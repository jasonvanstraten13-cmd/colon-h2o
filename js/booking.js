/* ===========================================
   COLON H2O — Public booking form (contact.html)
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {
  const supabase = getSupabaseClient();
  const form = document.getElementById('booking-form');
  if (!supabase || !form) return;

  const dateInput = document.getElementById('booking-date');
  const calDays = document.getElementById('booking-cal-days');
  const calMonthLabel = document.getElementById('cal-month-label');
  const calPrevBtn = document.getElementById('cal-prev');
  const calNextBtn = document.getElementById('cal-next');
  const calLoader = document.getElementById('booking-cal-loader');
  const slotGrid = document.getElementById('booking-slot-grid');
  const slotStatus = document.getElementById('booking-slot-status');
  const submitBtn = document.getElementById('booking-submit');
  const successBox = document.getElementById('booking-success');
  const errorBox = document.getElementById('booking-error');

  let selectedTime = '';
  let selectedDate = '';
  let viewMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  let blockedWholeDays = [];
  const todayKey = todayStr();

  function setCalLoading(isLoading) {
    if (calLoader) calLoader.style.display = isLoading ? 'flex' : 'none';
  }

  async function loadBlockedDaysForMonth() {
    const monthStart = `${viewMonth.getFullYear()}-${String(viewMonth.getMonth() + 1).padStart(2, '0')}-01`;
    const monthEndDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);
    const monthEnd = monthEndDate.toISOString().slice(0, 10);
    try {
      const { data, error } = await supabase
        .from('unavailable_slots')
        .select('blocked_date')
        .is('blocked_time', null)
        .gte('blocked_date', monthStart)
        .lte('blocked_date', monthEnd);
      blockedWholeDays = error ? [] : (data || []).map((r) => r.blocked_date);
    } catch {
      blockedWholeDays = [];
    }
  }

  function renderCalendar() {
    calMonthLabel.textContent = viewMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' });
    calDays.innerHTML = '';

    const firstWeekday = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay();
    const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();

    for (let i = 0; i < firstWeekday; i++) {
      const filler = document.createElement('div');
      calDays.appendChild(filler);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d);
      const key = dateObj.toISOString().slice(0, 10);
      const isPast = key < todayKey;
      const isBlocked = blockedWholeDays.includes(key);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-day-btn';
      btn.textContent = String(d);
      if (key === todayKey) btn.classList.add('today');
      if (key === selectedDate) btn.classList.add('selected');
      if (isPast || isBlocked) {
        btn.disabled = true;
        btn.classList.add('disabled');
        if (isBlocked) btn.title = 'Not available';
      } else {
        btn.addEventListener('click', () => selectDate(key));
      }
      calDays.appendChild(btn);
    }
  }

  function selectDate(key) {
    selectedDate = key;
    dateInput.value = key;
    renderCalendar();
    loadSlotsForDate(key);
  }

  function renderSlots(takenSlots) {
    slotGrid.innerHTML = '';
    hourlySlots().forEach((slot) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot-btn';
      btn.textContent = slot;
      const isTaken = takenSlots.includes(slot);
      if (isTaken) {
        btn.classList.add('taken');
        btn.disabled = true;
      }
      btn.addEventListener('click', () => {
        selectedTime = slot;
        slotGrid.querySelectorAll('.slot-btn').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        submitBtn.disabled = false;
      });
      slotGrid.appendChild(btn);
    });
  }

  async function loadSlotsForDate(date) {
    selectedTime = '';
    submitBtn.disabled = true;
    slotStatus.textContent = 'Checking availability…';
    setCalLoading(true);
    slotGrid.innerHTML = '';

    let taken = [];
    let wholeDayBlocked = false;
    try {
      const { data, error } = await supabase
        .from('unavailable_slots')
        .select('blocked_time')
        .eq('blocked_date', date);
      if (!error) {
        const rows = data || [];
        wholeDayBlocked = rows.some((r) => r.blocked_time === null);
        taken = rows.map((r) => r.blocked_time).filter(Boolean);
      }
    } catch {
      // network/config issue — fall back to showing all slots as open
    }

    setCalLoading(false);

    if (wholeDayBlocked) {
      slotStatus.textContent = "Sorry, this date isn't available. Please pick another day.";
      slotGrid.innerHTML = '';
      return;
    }

    slotStatus.textContent = '';
    renderSlots(taken);
  }

  calPrevBtn.addEventListener('click', async () => {
    viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1);
    setCalLoading(true);
    await loadBlockedDaysForMonth();
    renderCalendar();
    setCalLoading(false);
  });
  calNextBtn.addEventListener('click', async () => {
    viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);
    setCalLoading(true);
    await loadBlockedDaysForMonth();
    renderCalendar();
    setCalLoading(false);
  });

  // Brief loading state while the calendar widget itself initialises
  setCalLoading(true);
  loadBlockedDaysForMonth().finally(() => {
    renderCalendar();
    setCalLoading(false);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!dateInput.value || !selectedTime) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    errorBox.style.display = 'none';

    const payload = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      service: form.service.value,
      message: form.message.value,
      requested_date: dateInput.value,
      requested_time: selectedTime,
      status: 'pending',
    };

    const { error } = await supabase.from('bookings').insert(payload);

    if (error) {
      errorBox.textContent = "Something went wrong sending your request. Please try again or contact us directly.";
      errorBox.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Request Booking';
      return;
    }

    form.style.display = 'none';
    successBox.style.display = 'block';
    successBox.textContent = `Thank you — your booking request for ${dateInput.value} at ${selectedTime} has been received. We'll confirm by email once it's approved.`;
  });
});
