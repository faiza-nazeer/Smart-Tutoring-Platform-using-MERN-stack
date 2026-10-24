// Small helpers shared by the tutor pages.
import { apiFetch } from '../api/api'

export const asArray = (data: any): any[] => (Array.isArray(data) ? data : [])

export const initials = (name?: string) =>
  (name || '?').split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)

export const money = (n: number) => `Rs ${Math.round(n || 0).toLocaleString()}`

// Booking dates are stored as "YYYY-MM-DD".
export const parseDate = (d?: string) => (d ? new Date(`${d}T00:00:00`) : new Date(NaN))

export const fmtDate = (d?: string) => {
  const date = parseDate(d)
  return isNaN(date.getTime())
    ? d || '—'
    : date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

// Bookings returned by the API are already limited to the logged-in user.
export const loadMyBookings = async (): Promise<any[]> =>
  asArray(await (await apiFetch('/bookings')).json())

export const loadTutorReviews = async (tutorId: string): Promise<any[]> =>
  asArray(await (await apiFetch(`/reviews/tutor/${tutorId}`)).json())

export const isUpcoming = (b: any) => b.status === 'Pending' || b.status === 'Confirmed'

// Earnings per month for the last `months` months, counted from completed sessions.
export const monthlyEarnings = (bookings: any[], months = 6) => {
  const now = new Date()
  const buckets = Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1)
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      month: d.toLocaleDateString('en-GB', { month: 'short' }),
      amount: 0,
      sessions: 0,
    }
  })
  for (const b of bookings.filter(x => x.status === 'Completed')) {
    const d = parseDate(b.date)
    const bucket = buckets.find(x => x.key === `${d.getFullYear()}-${d.getMonth()}`)
    if (bucket) {
      bucket.amount += b.amount || 0
      bucket.sessions += 1
    }
  }
  return buckets
}

export const averageRating = (reviews: any[]) =>
  reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0
