import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch, updateBooking } from '../api/api'
import { useAuth } from '../context/AuthContext'
import TutorLayout from '../components/TutorLayout'
import {
  asArray, averageRating, fmtDate, initials, isUpcoming, loadMyBookings,
  loadTutorReviews, money, monthlyEarnings,
} from '../utils/tutor'
import './TutorDashboard.css'

function TutorDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  useEffect(() => {
    if (!user?._id) return
    Promise.all([
      loadMyBookings(),
      apiFetch('/courses').then(r => r.json()),
      loadTutorReviews(user._id),
    ])
      .then(([b, c, r]) => {
        setBookings(b)
        setCourses(asArray(c).filter((x: any) => x.tutor?._id === user._id))
        setReviews(r)
      })
      .catch(() => setError('Could not load your dashboard. Please refresh.'))
      .finally(() => setLoading(false))
  }, [user?._id])

  const changeStatus = async (id: string, status: string) => {
    setBusyId(id)
    setError('')
    const data = await updateBooking(id, { status })
    if (data?._id) {
      setBookings(prev => prev.map(b => (b._id === id ? { ...b, status: data.status } : b)))
    } else {
      setError(data?.message || 'Could not update the session.')
    }
    setBusyId('')
  }

  const upcoming = bookings
    .filter(isUpcoming)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
  const completed = bookings.filter(b => b.status === 'Completed')
  const pendingCount = bookings.filter(b => b.status === 'Pending').length
  const students = new Set(bookings.filter(b => b.status !== 'Cancelled').map(b => b.student?._id)).size
  const avg = averageRating(reviews)
  const earnings = monthlyEarnings(bookings, 6)
  const maxEarning = Math.max(...earnings.map(e => e.amount), 1)
  const firstName = (user?.name || 'Tutor').split(' ')[0]

  const stats = [
    { label: 'Students', value: students, icon: '👨‍🎓' },
    { label: 'Sessions Done', value: completed.length, icon: '✅' },
    { label: 'Pending Requests', value: pendingCount, icon: '⏳' },
    { label: 'Avg Rating', value: reviews.length ? avg.toFixed(1) : '—', icon: '⭐' },
  ]

  return (
    <TutorLayout>
      {loading ? (
        <div className="tx-loading">Loading dashboard...</div>
      ) : (
        <>
          <div className="td-welcome">
            <div>
              <h1>Welcome back, {firstName}! 👋</h1>
              <p>Here's your teaching overview.</p>
            </div>
          </div>

          {error && <div className="tx-error">{error}</div>}

          {!(user?.price > 0) && (
            <div className="tx-error">
              Students can't book you until you set your session price.{' '}
              <Link to="/dashboard/tutor/profile" className="tx-link">Set it in My Profile</Link>
            </div>
          )}

          <div className="td-stats-row">
            {stats.map(stat => (
              <div className="td-stat-card" key={stat.label}>
                <span className="td-stat-card__icon">{stat.icon}</span>
                <span className="td-stat-card__value">{stat.value}</span>
                <span className="td-stat-card__label">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="td-cols">
            <section className="td-section">
              <div className="td-section__header">
                <h2>Upcoming Sessions</h2>
                <Link to="/dashboard/tutor/sessions" className="td-section__link">View all</Link>
              </div>
              <div className="td-sessions">
                {upcoming.length === 0 ? (
                  <div className="tx-empty">No upcoming sessions yet</div>
                ) : (
                  upcoming.slice(0, 4).map((s: any) => (
                    <div className="td-session-card" key={s._id}>
                      <div className="td-avatar">{initials(s.student?.name)}</div>
                      <div className="td-session-card__info">
                        <p className="td-session-card__name">{s.student?.name}</p>
                        <p className="td-session-card__subject">{s.subject}</p>
                      </div>
                      <div className="td-session-card__time">
                        <p className="td-session-card__date">{fmtDate(s.date)}</p>
                        <p>{s.time}{s.duration ? ` · ${s.duration}` : ''}</p>
                      </div>
                      {s.status === 'Pending' ? (
                        <button className="td-start-btn" disabled={busyId === s._id} onClick={() => changeStatus(s._id, 'Confirmed')}>
                          Accept
                        </button>
                      ) : (
                        <button className="td-start-btn" disabled={busyId === s._id} onClick={() => changeStatus(s._id, 'Completed')}>
                          Complete
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="td-section">
              <div className="td-section__header">
                <h2>Monthly Earnings</h2>
                <Link to="/dashboard/tutor/earnings" className="td-section__link">View all</Link>
              </div>
              <div className="td-earnings-chart">
                {earnings.map(e => (
                  <div className="td-bar-wrap" key={e.key}>
                    <div className="td-bar-amount">{e.amount ? `Rs ${(e.amount / 1000).toFixed(1)}k` : '—'}</div>
                    <div className="td-bar-track">
                      <div className="td-bar-fill" style={{ height: `${(e.amount / maxEarning) * 100}%` }} />
                    </div>
                    <div className="td-bar-month">{e.month}</div>
                  </div>
                ))}
              </div>
              <p className="tx-note">Based on completed sessions. Total so far: {money(completed.reduce((s, b) => s + (b.amount || 0), 0))}</p>
            </section>
          </div>

          <div className="td-cols">
            <section className="td-section">
              <div className="td-section__header">
                <h2>My Courses</h2>
                <Link to="/dashboard/tutor/courses" className="td-section__link">Manage</Link>
              </div>
              <div className="td-courses">
                {courses.length === 0 ? (
                  <div className="tx-empty">
                    No courses yet. <Link to="/dashboard/tutor/courses" className="tx-link">Create your first course</Link>
                  </div>
                ) : (
                  courses.slice(0, 4).map((c: any) => (
                    <div className="td-course-card" key={c._id}>
                      <div className="td-course-card__info">
                        <h4>{c.title}</h4>
                        <p>{c.subject} · {c.level || 'All Levels'} · {money(c.price)}/session</p>
                      </div>
                      <div className="td-progress-label">
                        <span>Status</span>
                        <span style={{ color: c.status === 'Draft' ? '#999' : 'var(--purple)', fontWeight: 600 }}>{c.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="td-section">
              <div className="td-section__header">
                <h2>Recent Reviews</h2>
                <Link to="/dashboard/tutor/reviews" className="td-section__link">View all</Link>
              </div>
              <div className="td-reviews">
                {reviews.length === 0 ? (
                  <div className="tx-empty">No reviews yet</div>
                ) : (
                  [...reviews].reverse().slice(0, 3).map((r: any) => (
                    <div className="td-review-card" key={r._id}>
                      <div className="td-review-card__top">
                        <div className="td-avatar td-avatar--sm">{initials(r.student?.name)}</div>
                        <div>
                          <p className="td-review-card__name">{r.student?.name}</p>
                          <p className="td-review-card__date">{new Date(r.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="td-review-card__stars">{'⭐'.repeat(r.rating)}</div>
                      </div>
                      <p className="td-review-card__comment">"{r.comment}"</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </TutorLayout>
  )
}

export default TutorDashboard
