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
  const blockDate = document.getElementById('block-date');
  const blockTime = document.getElementById('block-time');
  const blockReason = document.getElementById('block-reason');
  const blockError = document.getElementById('block-error');
  const blockSubmit = document.getElementById('block-submit');
  const blockedList = document.getElementById('blocked-list');
  const blockedEmpty = document.getElementById('blocked-empty');

  let bookings = [];
  let blockedSlots = [];
  let calDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  hourlySlots().forEach((slot) => {
    const opt = document.createElement('option');
    opt.value = slot;
    opt.textContent = slot;
    blockTime.appendChild(opt);
  });
  blockDate.min = todayStr();

  function showError(el, message) {
    el.textContent = message;
    el.style.display = message ? 'block' : 'none';
  }

  async function loadBookings() {
    const [bookingsRes, blockedRes] = await Promise.all([
      supabase.from('bookings').select('*').order('requested_date', { ascending: true }),
      supabase.from('blocked_slots').select('*').order('blocked_date', { ascending: true }),
    ]);
    if (bookingsRes.error) {
      showError(adminError, 'Failed to load bookings.');
      return;
    }
    bookings = bookingsRes.data || [];
    blockedSlots = blockedRes.error ? [] : (blockedRes.data || []);
    renderPending();
    renderBlockedList();
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
    const blockedByDay = {};
    blockedSlots.forEach((b) => {
      blockedByDay[b.blocked_date] = blockedByDay[b.blocked_date] || [];
      blockedByDay[b.blocked_date].push(b);
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
      const dayBlocks = blockedByDay[key] || [];
      const isFullyBlocked = dayBlocks.some((b) => !b.blocked_time);

      const cell = document.createElement('div');
      cell.className = 'cal-cell';
      cell.style.cursor = 'pointer';
      if (isFullyBlocked) cell.style.background = '#fdecea';
      cell.innerHTML = `<div>${d}</div>` + dayBookings.slice(0, 2).map((b) => `<div class="cal-chip">${b.requested_time} ${b.name}</div>`).join('') +
        (dayBookings.length > 2 ? `<div style="font-size:0.7rem;color:var(--gray-dark);">+${dayBookings.length - 2} more</div>` : '') +
        (isFullyBlocked ? '<div style="font-size:0.7rem;color:#c0392b;">Blocked</div>' : '');
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

  function renderBlockedList() {
    const upcoming = blockedSlots.filter((b) => b.blocked_date >= todayStr());
    blockedEmpty.style.display = upcoming.length === 0 ? 'block' : 'none';
    blockedList.innerHTML = '';

    upcoming.forEach((b) => {
      const row = document.createElement('div');
      row.className = 'booking-row';
      row.innerHTML = `
        <p style="font-weight:700;">${b.blocked_date}${b.blocked_time ? ' at ' + b.blocked_time : ' (whole day)'}</p>
        ${b.reason ? `<p style="font-size:0.85rem;color:var(--gray-dark);">${b.reason}</p>` : ''}
        <div class="booking-actions">
          <button class="btn btn-deny" data-remove-id="${b.id}">Remove</button>
        </div>
      `;
      blockedList.appendChild(row);
    });

    blockedList.querySelectorAll('button[data-remove-id]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        const { error } = await supabase.from('blocked_slots').delete().eq('id', btn.dataset.removeId);
        if (error) {
          showError(blockError, 'Failed to remove — please try again.');
          btn.disabled = false;
          return;
        }
        await loadBookings();
      });
    });
  }

  blockSubmit.addEventListener('click', async () => {
    showError(blockError, '');
    if (!blockDate.value) {
      showError(blockError, 'Please choose a date.');
      return;
    }
    blockSubmit.disabled = true;
    const { error } = await supabase.from('blocked_slots').insert({
      blocked_date: blockDate.value,
      blocked_time: blockTime.value || null,
      reason: blockReason.value || null,
    });
    blockSubmit.disabled = false;
    if (error) {
      showError(blockError, 'Failed to save — please try again.');
      return;
    }
    blockDate.value = '';
    blockTime.value = '';
    blockReason.value = '';
    await loadBookings();
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
