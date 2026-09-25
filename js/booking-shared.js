/* ===========================================
   COLON H2O — Supabase booking helpers
   Shared by booking.js (public form) and admin.js (dashboard)
   =========================================== */

const START_HOUR = 8;
const END_HOUR = 17; // last bookable slot starts at END_HOUR - 1

function getSupabaseClient() {
  if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    console.error('Supabase is not configured — check js/supabase-config.js');
    return null;
  }
  if (!window.__colonH2OSupabaseClient) {
    window.__colonH2OSupabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }
  return window.__colonH2OSupabaseClient;
}

function hourlySlots() {
  const slots = [];
  for (let h = START_HOUR; h < END_HOUR; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
  }
  return slots;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
