import { Link, useLocation } from 'react-router-dom';
import './StudentDashboard.css'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react';

function StudentDashboard() {
  const location = useLocation();
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/bookings').then(r => r.json()),
      fetch('http://localhost:5000/api/courses').then(r => r.json()),
    ]).then(([bookingsData, coursesData]) => {
      const myBookings = bookingsData.filter((b: any) => b.student?._id === user?._id)
      setBookings(myBookings)
      setCourses(coursesData)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user])

  const STUDENT = {
    name: user?.name || 'Student',
    email: user?.email || '',
    avatar: user?.name?.slice(0, 2).toUpperCase() || 'S',
  }

  const upcomingSessions = bookings.filter(b =>
    b.status === 'Pending' || b.status === 'Confirmed'
  )
  const completedSessions = bookings.filter(b => b.status === 'Completed')

  const stats = [
    { label: 'Sessions Completed', value: completedSessions.length, icon: '✅' },
    { label: 'Total Bookings', value: bookings.length, icon: '📅' },
    { label: 'Courses Available', value: courses.length, icon: '📚' },
    { label: 'Tutors Available', value: '6', icon: '🎓' },
  ]

  const navLinks = [
    { to: '/dashboard/student', label: '🏠 Dashboard' },
    { to: '/dashboard/courses', label: '📚 My Courses' },
    { to: '/dashboard/sessions', label: '📅 My Sessions' },
    { to: '/dashboard/find-tutors', label: '🔍 Find Tutors' },
    { to: '/dashboard/profile', label: '👤 My Profile' },
  ]

  if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard...</div>

  return (
    <div className="sd-page">
      <Navbar />
      <div className="sd-body">

        <aside className="sd-sidebar">
          <div className="sd-profile">
            <div className="sd-profile__avatar">{STUDENT.avatar}</div>
            <p className="sd-profile__name">{STUDENT.name}</p>
            <p className="sd-profile__email">{STUDENT.email}</p>
            <span className="sd-profile__badge">Student</span>
          </div>

          <nav className="sd-nav">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`sd-nav__link ${location.pathname === link.to ? 'sd-nav__link--active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            className="sd-logout-btn"
            onClick={() => { logout(); window.location.href = '/login'; }}
          >
            Log Out
          </button>
        </aside>

        <main className="sd-main">

          <div className="sd-welcome">
            <div>
              <h1 className="sd-welcome__heading">
                Welcome back, {STUDENT.name.split(' ')[0]}! 👋
              </h1>
              <p className="sd-welcome__sub">
                Here's what's happening with your learning today.
              </p>
            </div>
            <Link to="/dashboard/find-tutors" className="sd-find-tutor-btn">
              + Find a Tutor
            </Link>
          </div>

          <div className="sd-stats-row">
            {stats.map(stat => (
              <div className="sd-stat-card" key={stat.label}>
                <span className="sd-stat-card__icon">{stat.icon}</span>
                <span className="sd-stat-card__value">{stat.value}</span>
                <span className="sd-stat-card__label">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="sd-cols">

            {/* Upcoming sessions */}
            <section className="sd-section">
              <div className="sd-section__header">
                <h2 className="sd-section__heading">Upcoming Sessions</h2>
                <Link to="/dashboard/sessions" className="sd-section__link">View all</Link>
              </div>
              <div className="sd-sessions">
                {upcomingSessions.length === 0 ? (
                  <div style={{
                    textAlign: 'center', padding: '2rem', color: 'var(--gray)'
                  }}>
                    <p>No upcoming sessions</p>
                    <Link
                      to="/dashboard/find-tutors"
                      style={{ color: 'var(--purple)', fontWeight: 600 }}
                    >
                      Book a session →
                    </Link>
                  </div>
                ) : (
                  upcomingSessions.map((s: any) => (
                    <div className="sd-session-card" key={s._id}>
                      <div className="sd-session-card__avatar">
                        {s.tutor?.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="sd-session-card__info">
                        <p className="sd-session-card__tutor">{s.tutor?.name}</p>
                        <p className="sd-session-card__subject">{s.subject}</p>
                      </div>
                      <div className="sd-session-card__time">
                        <p className="sd-session-card__date">{s.date}</p>
                        <p className="sd-session-card__clock">
                          {s.time} · {s.duration}
                        </p>
                      </div>
                      <button
                        className="sd-session-card__join-btn"
                        onClick={() => window.open('https://meet.google.com', '_blank')}
                      >
                        Join
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Available courses */}
            <section className="sd-section">
              <div className="sd-section__header">
                <h2 className="sd-section__heading">Available Courses</h2>
                <Link to="/courses" className="sd-section__link">View all</Link>
              </div>
              <div className="sd-courses">
                {courses.slice(0, 3).map((c: any) => (
                  <div className="sd-course-card" key={c._id}>
                    <div className="sd-course-card__left">
                      <div className="sd-course-card__avatar">
                        {c.tutor?.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="sd-course-card__title">{c.title}</p>
                        <p className="sd-course-card__tutor">
                          {c.tutor?.name} · {c.subject}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.82rem' }}>
                      <p style={{ color: 'var(--orange)', fontWeight: 700 }}>
                        Rs {c.price}/hr
                      </p>
                      <p style={{ color: 'var(--gray)' }}>⭐ {c.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  )
}

export default StudentDashboard