import { Link, useLocation } from 'react-router-dom';
import './TutorDashboard.css';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const EARNINGS = [
  { month: 'Jan', amount: 55000 },
  { month: 'Feb', amount: 62000 },
  { month: 'Mar', amount: 58000 },
  { month: 'Apr', amount: 72000 },
]

const maxEarning = Math.max(...EARNINGS.map(e => e.amount));

function TutorDashboard() {
  const location = useLocation();
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/bookings').then(r => r.json()),
      fetch('http://localhost:5000/api/courses').then(r => r.json()),
      fetch('http://localhost:5000/api/reviews').then(r => r.json()),
    ]).then(([bookingsData, coursesData, reviewsData]) => {
      // Filter data for logged in tutor
      const myBookings = bookingsData.filter((b: any) => b.tutor?._id === user?._id)
      const myCourses = coursesData.filter((c: any) => c.tutor?._id === user?._id)
      const myReviews = reviewsData.filter((r: any) => r.tutor?._id === user?._id)
      setBookings(myBookings)
      setCourses(myCourses)
      setReviews(myReviews)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user])

  const TUTOR = {
    name: user?.name || 'Tutor',
    email: user?.email || '',
    avatar: user?.name?.slice(0, 2).toUpperCase() || 'T',
    subject: user?.subject || 'Subject',
  }

  const upcomingSessions = bookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed')
  const completedSessions = bookings.filter(b => b.status === 'Completed')
  const totalStudents = new Set(bookings.map(b => b.student?._id)).size
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'N/A'

  const stats = [
    { label: 'Total Students', value: totalStudents, icon: '👨‍🎓' },
    { label: 'Sessions Done', value: completedSessions.length, icon: '✅' },
    { label: 'Total Bookings', value: bookings.length, icon: '📅' },
    { label: 'Avg Rating', value: avgRating, icon: '⭐' },
  ]

  const navLinks = [
    { to: '/dashboard/tutor', label: '🏠 Dashboard' },
    { to: '/dashboard/tutor/sessions', label: '📅 My Sessions' },
    { to: '/dashboard/tutor/courses', label: '📚 My Courses' },
    { to: '/dashboard/tutor/students', label: '👨‍🎓 My Students' },
    { to: '/dashboard/tutor/earnings', label: '💰 Earnings' },
    { to: '/dashboard/tutor/profile', label: '👤 My Profile' },
    { to: '/dashboard/tutor/reviews', label: '⭐ Reviews' },
  ]

  if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard...</div>

  return (
    <div className="td-page">
      <div className="td-body">

        <aside className="td-sidebar">
          <div className="td-logo">🎓 ETutor</div>

          <div className="td-profile">
            <div className="td-profile__avatar">{TUTOR.avatar}</div>
            <p className="td-profile__name">{TUTOR.name}</p>
            <p className="td-profile__subject">{TUTOR.subject} Tutor</p>
            <span className="td-profile__badge">Tutor</span>
          </div>

          <nav className="td-nav">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`td-nav__link ${location.pathname === link.to ? 'td-nav__link--active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            className="td-logout-btn"
            onClick={() => { logout(); window.location.href = '/login'; }}
          >
            Log Out
          </button>
        </aside>

        <main className="td-main">

          <div className="td-welcome">
            <div>
              <h1>Welcome back, {TUTOR.name.split(' ')[0]}! 👋</h1>
              <p>Here's your teaching overview for today.</p>
            </div>
            <button className="td-availability-btn">✅ Available for Booking</button>
          </div>

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

            {/* Upcoming Sessions */}
            <section className="td-section">
              <div className="td-section__header">
                <h2>Upcoming Sessions</h2>
                <Link to="/dashboard/tutor/sessions" className="td-section__link">View all</Link>
              </div>
              <div className="td-sessions">
                {upcomingSessions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)' }}>
                    <p>No upcoming sessions yet</p>
                  </div>
                ) : (
                  upcomingSessions.map((s: any) => (
                    <div className="td-session-card" key={s._id}>
                      <div className="td-avatar">
                        {s.student?.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="td-session-card__info">
                        <p className="td-session-card__name">{s.student?.name}</p>
                        <p className="td-session-card__subject">{s.subject}</p>
                      </div>
                      <div className="td-session-card__time">
                        <p className="td-session-card__date">{s.date}</p>
                        <p>{s.time} · {s.duration}</p>
                      </div>
                      <button className="td-start-btn">Start</button>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Earnings Chart */}
            <section className="td-section">
              <div className="td-section__header">
                <h2>Monthly Earnings</h2>
                <Link to="/dashboard/tutor/earnings" className="td-section__link">View all</Link>
              </div>
              <div className="td-earnings-chart">
                {EARNINGS.map(e => (
                  <div className="td-bar-wrap" key={e.month}>
                    <div className="td-bar-amount">Rs {(e.amount / 1000).toFixed(0)}k</div>
                    <div className="td-bar-track">
                      <div
                        className="td-bar-fill"
                        style={{ height: `${(e.amount / maxEarning) * 100}%` }}
                      />
                    </div>
                    <div className="td-bar-month">{e.month}</div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          <div className="td-cols">

            {/* My Courses */}
            <section className="td-section">
              <div className="td-section__header">
                <h2>My Courses</h2>
                <Link to="/dashboard/tutor/courses" className="td-section__link">View all</Link>
              </div>
              <div className="td-courses">
                {courses.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)' }}>
                    <p>No courses yet</p>
                  </div>
                ) : (
                  courses.map((c: any) => (
                    <div className="td-course-card" key={c._id}>
                      <div className="td-course-card__info">
                        <h4>{c.title}</h4>
                        <p>{c.studentsEnrolled} students enrolled · ⭐ {c.rating}</p>
                      </div>
                      <div className="td-progress-label">
                        <span>Status</span>
                        <span style={{ color: 'var(--purple)', fontWeight: 600 }}>{c.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Recent Reviews */}
            <section className="td-section">
              <div className="td-section__header">
                <h2>Recent Reviews</h2>
              </div>
              <div className="td-reviews">
                {reviews.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)' }}>
                    <p>No reviews yet</p>
                  </div>
                ) : (
                  reviews.slice(0, 3).map((r: any) => (
                    <div className="td-review-card" key={r._id}>
                      <div className="td-review-card__top">
                        <div className="td-avatar td-avatar--sm">
                          {r.student?.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="td-review-card__name">{r.student?.name}</p>
                          <p className="td-review-card__date">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="td-review-card__stars">
                          {'⭐'.repeat(r.rating)}
                        </div>
                      </div>
                      <p className="td-review-card__comment">"{r.comment}"</p>
                    </div>
                  ))
                )}
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  )
}

export default TutorDashboard