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
  const todayKey = todayStr();

  function setCalLoading(isLoading) {
    if (calLoader) calLoader.style.display = isLoading ? 'flex' : 'none';
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

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-day-btn';
      btn.textContent = String(d);
      if (key === todayKey) btn.classList.add('today');
      if (key === selectedDate) btn.classList.add('selected');
      if (isPast) {
        btn.disabled = true;
        btn.classList.add('disabled');
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
    try {
      const { data, error } = await supabase
        .from('approved_slots')
        .select('requested_time')
        .eq('requested_date', date);
      if (!error) taken = (data || []).map((r) => r.requested_time);
    } catch {
      // network/config issue — fall back to showing all slots as open
    }

    slotStatus.textContent = '';
    setCalLoading(false);
    renderSlots(taken);
  }

  calPrevBtn.addEventListener('click', () => {
    viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1);
    renderCalendar();
  });
  calNextBtn.addEventListener('click', () => {
    viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);
    renderCalendar();
  });

  // Brief loading state while the calendar widget itself initialises
  setCalLoading(true);
  setTimeout(() => {
    renderCalendar();
    setCalLoading(false);
  }, 350);

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
