/* ===========================================
   COLON H2O — Admin booking dashboard (admin.html)
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const loginBox = document.getElementById('admin-login');
  const dashboardBox = document.getElementById('admin-dashboard');
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  const loginError = document.getElementById('login-error');
  const adminError = document.getElementById('admin-error');
  const pendingList = document.getElementById('pending-list');
  const pendingEmpty = document.getElementById('pending-empty');
  const pendingHeading = document.getElementById('pending-heading');
  const calGrid = document.getElementById('cal-grid');
  const calTitle = document.getElementById('cal-title');
  const dayDetail = document.getElementById('day-detail');
  const dayDetailTitle = document.getElementById('day-detail-title');
  const dayDetailList = document.getElementById('day-detail-list');

  let bookings = [];
  let calDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  function showError(el, message) {
    el.textContent = message;
    el.style.display = message ? 'block' : 'none';
  }

  async function loadBookings() {
    const { data, error } = await supabase.from('bookings').select('*').order('requested_date', { ascending: true });
    if (error) {
      showError(adminError, 'Failed to load bookings.');
      return;
    }
    bookings = data || [];
    renderPending();
    renderCalendar();
  }

  function renderPending() {
    const pending = bookings.filter((b) => b.status === 'pending');
    pendingHeading.textContent = `Pending Requests (${pending.length})`;
    pendingList.innerHTML = '';
    pendingEmpty.style.display = pending.length === 0 ? 'block' : 'none';

    pending.forEach((b) => {
      const row = document.createElement('div');
      row.className = 'booking-row';
      row.innerHTML = `
        <p style="font-weight:700;">${b.name} — ${b.service}</p>
        <p style="font-size:0.85rem;color:var(--gray-dark);">${b.requested_date} at ${b.requested_time} • ${b.email} • ${b.phone}</p>
        ${b.message ? `<p style="font-size:0.85rem;">${b.message}</p>` : ''}
        <div class="booking-actions">
          <button class="btn btn-primary" data-action="approve" data-id="${b.id}">Approve</button>
          <button class="btn btn-deny" data-action="deny" data-id="${b.id}">Deny</button>
        </div>
      `;
      pendingList.appendChild(row);
    });

    pendingList.querySelectorAll('button[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const booking = bookings.find((b) => b.id === btn.dataset.id);
        const decision = btn.dataset.action === 'approve' ? 'approved' : 'denied';
        decide(booking, decision, btn);
      });
    });
  }

  async function decide(booking, decision, btn) {
    showError(adminError, '');
    btn.disabled = true;

    if (decision === 'approved') {
      const conflict = bookings.find(
        (b) => b.id !== booking.id && b.status === 'approved' &&
          b.requested_date === booking.requested_date && b.requested_time === booking.requested_time
      );
      if (conflict) {
        showError(adminError, 'That slot is already booked by another approved client.');
        btn.disabled = false;
        return;
      }
    }

    const { error } = await supabase.from('bookings').update({ status: decision }).eq('id', booking.id);
    if (error) {
      showError(adminError, 'Failed to update booking status.');
      btn.disabled = false;
      return;
    }

    try {
      await supabase.functions.invoke('send-booking-email', { body: { booking, decision } });
    } catch {
      showError(adminError, 'Booking updated, but the notification email failed to send.');
    }

    await loadBookings();
  }

  function renderCalendar() {
    const approved = bookings.filter((b) => b.status === 'approved');
    const approvedByDay = {};
    approved.forEach((b) => {
      approvedByDay[b.requested_date] = approvedByDay[b.requested_date] || [];
      approvedByDay[b.requested_date].push(b);
    });

    calTitle.textContent = calDate.toLocaleString(undefined, { month: 'long', year: 'numeric' });
    calGrid.innerHTML = '';

    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((d) => {
      const cell = document.createElement('div');
      cell.className = 'cal-headcell';
      cell.textContent = d;
      calGrid.appendChild(cell);
    });

    const firstWeekday = new Date(calDate.getFullYear(), calDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 0).getDate();

    for (let i = 0; i < firstWeekday; i++) {
      const cell = document.createElement('div');
      cell.className = 'cal-cell';
      cell.style.opacity = '0.3';
      calGrid.appendChild(cell);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(calDate.getFullYear(), calDate.getMonth(), d);
      const key = dateObj.toISOString().slice(0, 10);
      const dayBookings = approvedByDay[key] || [];

      const cell = document.createElement('div');
      cell.className = 'cal-cell';
      cell.style.cursor = 'pointer';
      cell.innerHTML = `<div>${d}</div>` + dayBookings.slice(0, 2).map((b) => `<div class="cal-chip">${b.requested_time} ${b.name}</div>`).join('') +
        (dayBookings.length > 2 ? `<div style="font-size:0.7rem;color:var(--gray-dark);">+${dayBookings.length - 2} more</div>` : '');
      cell.addEventListener('click', () => showDayDetail(key, dayBookings));
      calGrid.appendChild(cell);
    }
  }

  function showDayDetail(dateKey, dayBookings) {
    dayDetail.style.display = 'block';
    dayDetailTitle.textContent = `Bookings on ${dateKey}`;
    dayDetailList.innerHTML = dayBookings.length === 0
      ? '<p style="color:var(--gray-dark);">No approved bookings on this day.</p>'
      : dayBookings.map((b) => `
          <div class="booking-row">
            <p style="font-weight:700;">${b.name} — ${b.service}</p>
            <p style="font-size:0.85rem;color:var(--gray-dark);">${b.requested_time} • ${b.email} • ${b.phone}</p>
          </div>
        `).join('');
  }

  document.getElementById('cal-prev').addEventListener('click', () => {
    calDate = new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1);
    renderCalendar();
  });
  document.getElementById('cal-next').addEventListener('click', () => {
    calDate = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1);
    renderCalendar();
  });

  document.getElementById('login-submit').addEventListener('click', async () => {
    showError(loginError, '');
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail.value, password: loginPassword.value });
    if (error) showError(loginError, 'Invalid email or password.');
  });

  document.getElementById('logout-btn').addEventListener('click', () => supabase.auth.signOut());

  function setSignedIn(isSignedIn) {
    loginBox.style.display = isSignedIn ? 'none' : 'block';
    dashboardBox.style.display = isSignedIn ? 'block' : 'none';
    if (isSignedIn) loadBookings();
  }

  supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
  supabase.auth.onAuthStateChange((_event, session) => setSignedIn(!!session));
});
