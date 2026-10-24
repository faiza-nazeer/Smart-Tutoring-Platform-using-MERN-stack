import { useEffect, useState } from 'react'
import TutorLayout from '../components/TutorLayout'
import { fmtDate, initials, isUpcoming, loadMyBookings, money, monthlyEarnings, parseDate } from '../utils/tutor'
import './TutorEarnings.css'

export default function TutorEarnings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadMyBookings()
      .then(setBookings)
      .catch(() => setError('Could not load earnings. Please refresh.'))
      .finally(() => setLoading(false))
  }, [])

  const completed = bookings.filter(b => b.status === 'Completed')
  const now = new Date()
  const thisMonth = completed.filter(b => {
    const d = parseDate(b.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const sum = (list: any[]) => list.reduce((s, b) => s + (b.amount || 0), 0)

  const monthly = monthlyEarnings(bookings, 6)
  const maxAmount = Math.max(...monthly.map(m => m.amount), 1)
  const recent = [...completed].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8)

  return (
    <TutorLayout flush>
      <div className="te-page">
        <div className="te-header">
          <div>
            <h1>Earnings</h1>
            <p>Income from your completed sessions</p>
          </div>
        </div>

        {error && <div className="tx-error">{error}</div>}

        {loading ? (
          <div className="tx-loading">Loading earnings...</div>
        ) : (
          <>
            <div className="te-stats">
              <div className="te-stat-card te-stat-card--highlight">
                <span className="te-stat-icon">💰</span>
                <span className="te-stat-value">{money(sum(thisMonth))}</span>
                <span className="te-stat-label">This Month</span>
              </div>
              <div className="te-stat-card">
                <span className="te-stat-icon">📈</span>
                <span className="te-stat-value">{money(sum(completed))}</span>
                <span className="te-stat-label">Total Earned</span>
              </div>
              <div className="te-stat-card">
                <span className="te-stat-icon">⏳</span>
                <span className="te-stat-value">{money(sum(bookings.filter(isUpcoming)))}</span>
                <span className="te-stat-label">Upcoming (not yet completed)</span>
              </div>
              <div className="te-stat-card">
                <span className="te-stat-icon">📅</span>
                <span className="te-stat-value">{thisMonth.length}</span>
                <span className="te-stat-label">Sessions This Month</span>
              </div>
            </div>

            <div className="te-cols">
              <section className="te-section">
                <h2>Last 6 Months</h2>
                <div className="te-chart">
                  {monthly.map(m => (
                    <div className="te-bar-wrap" key={m.key}>
                      <div className="te-bar-amount">{m.amount ? `Rs ${(m.amount / 1000).toFixed(1)}k` : '—'}</div>
                      <div className="te-bar-track">
                        <div className="te-bar-fill" style={{ height: `${(m.amount / maxAmount) * 100}%` }} />
                      </div>
                      <div className="te-bar-month">{m.month}</div>
                      <div className="te-bar-sessions">{m.sessions} sessions</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="te-section">
                <h2>Recent Completed Sessions</h2>
                <div className="te-transactions">
                  {recent.length === 0 ? (
                    <div className="tx-empty">Nothing here yet. Earnings appear once you mark a session as completed.</div>
                  ) : (
                    recent.map(t => (
                      <div className="te-transaction" key={t._id}>
                        <div className="te-t-avatar">{initials(t.student?.name)}</div>
                        <div className="te-t-info">
                          <p className="te-t-name">{t.student?.name}</p>
                          <p className="te-t-course">{t.subject} · {fmtDate(t.date)}</p>
                        </div>
                        <span className="te-t-amount">+{money(t.amount)}</span>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </TutorLayout>
  )
}
