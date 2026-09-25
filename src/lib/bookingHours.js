// Booking hours: 08:00–17:00, hourly slots, every day.
// Adjust START_HOUR / END_HOUR / CLOSED_WEEKDAYS if opening hours change.
export const START_HOUR = 8
export const END_HOUR = 17 // last bookable slot starts at END_HOUR - 1
export const CLOSED_WEEKDAYS = [] // 0=Sun..6=Sat, e.g. [0] to close Sundays

export function hourlySlots() {
  const slots = []
  for (let h = START_HOUR; h < END_HOUR; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
  }
  return slots
}

export function isClosedDate(dateStr) {
  if (!dateStr) return false
  const day = new Date(`${dateStr}T00:00:00`).getDay()
  return CLOSED_WEEKDAYS.includes(day)
}
