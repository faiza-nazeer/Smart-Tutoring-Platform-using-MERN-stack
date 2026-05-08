import { Link, useLocation } from 'react-router-dom';
import './TutorDashboard.css';

const TUTOR = { name: 'Ayesha Khan', email: 'ayesha@email.com', avatar: 'AK', subject: 'Mathematics', joinedDate: 'Mar 2024' }

const STATS = [
  { label: 'Total Students', value: '48', icon: '👨‍🎓' },
  { label: 'Sessions Done', value: '340', icon: '✅' },
  { label: 'Monthly Earnings', value: 'Rs 72,000', icon: '💰' },
  { label: 'Avg Rating', value: '4.9', icon: '⭐' },
]

const UPCOMING_SESSIONS = [
  { id: 1, student: 'Ahmed Khan', subject: 'Mathematics', date: 'Today', time: '5:00 PM', duration: '1 hr', avatar: 'AK' },
  { id: 2, student: 'Fatima Tariq', subject: 'Mathematics', date: 'Today', time: '7:00 PM', duration: '1 hr', avatar: 'FT' },
  { id: 3, student: 'Hassan Ali', subject: 'Mathematics', date: 'Tomorrow', time: '3:00 PM', duration: '1 hr', avatar: 'HA' },
  { id: 4, student: 'Zara Imran', subject: 'Mathematics', date: 'Sat, 30 Apr', time: '11:00 AM', duration: '1 hr', avatar: 'ZI' },
]

const MY_COURSES = [
  { id: 1, title: 'Master Mathematics', students: 18, progress: 75, rating: 4.9 },
  { id: 2, title: 'Advanced Algebra', students: 12, progress: 55, rating: 4.7 },
  { id: 3, title: 'Calculus Fundamentals', students: 18, progress: 90, rating: 4.8 },
]

const RECENT_REVIEWS = [
  { id: 1, student: 'Ahmed Khan', avatar: 'AK', rating: 5, comment: 'Excellent teaching style, very patient and clear.', date: '2 days ago' },
  { id: 2, student: 'Fatima Tariq', avatar: 'FT', rating: 5, comment: 'Best math tutor I have ever had!', date: '5 days ago' },
  { id: 3, student: 'Hassan Ali', avatar: 'HA', rating: 4, comment: 'Very knowledgeable and explains concepts well.', date: '1 week ago' },
]

const EARNINGS = [
  { month: 'Jan', amount: 55000 },
  { month: 'Feb', amount: 62000 },
  { month: 'Mar', amount: 58000 },
  { month: 'Apr', amount: 72000 },
]

const maxEarning = Math.max(...EARNINGS.map(e => e.amount));

function TutorDashboard() {
  const location = useLocation();

  const navLinks = [
    { to: '/dashboard/tutor', label: '🏠 Dashboard' },
    { to: '/dashboard/tutor/sessions', label: '📅 My Sessions' },
    { to: '/dashboard/tutor/courses', label: '📚 My Courses' },
    { to: '/dashboard/tutor/students', label: '👨‍🎓 My Students' },
    { to: '/dashboard/tutor/earnings', label: '💰 Earnings' },
    { to: '/dashboard/tutor/profile', label: '👤 My Profile' },
    { to: '/dashboard/tutor/settings', label: '⚙️ Settings' },
    { to: '/dashboard/tutor/reviews', label: '⭐ Reviews' },
  ]

  return (
    <div className="td-page">

      <div className="td-body">

        {/* Sidebar */}
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

          <Link to="/login" className="td-logout-btn">Log Out</Link>
        </aside>

        {/* Main */}
        <main className="td-main">

          {/* Welcome */}
          <div className="td-welcome">
            <div>
              <h1>Welcome back, {TUTOR.name.split(' ')[0]}! 👋</h1>
              <p>Here's your teaching overview for today.</p>
            </div>
            <button className="td-availability-btn">✅ Available for Booking</button>
          </div>

          {/* Stats */}
          <div className="td-stats-row">
            {STATS.map(stat => (
              <div className="td-stat-card" key={stat.label}>
                <span className="td-stat-card__icon">{stat.icon}</span>
                <span className="td-stat-card__value">{stat.value}</span>
                <span className="td-stat-card__label">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Two columns */}
          <div className="td-cols">

            {/* Upcoming Sessions */}
            <section className="td-section">
              <div className="td-section__header">
                <h2>Upcoming Sessions</h2>
                <Link to="/dashboard/tutor/sessions" className="td-section__link">View all</Link>
              </div>
              <div className="td-sessions">
                {UPCOMING_SESSIONS.map(s => (
                  <div className="td-session-card" key={s.id}>
                    <div className="td-avatar">{s.avatar}</div>
                    <div className="td-session-card__info">
                      <p className="td-session-card__name">{s.student}</p>
                      <p className="td-session-card__subject">{s.subject}</p>
                    </div>
                    <div className="td-session-card__time">
                      <p className="td-session-card__date">{s.date}</p>
                      <p>{s.time} · {s.duration}</p>
                    </div>
                    <button className="td-start-btn">Start</button>
                  </div>
                ))}
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

          {/* Bottom two columns */}
          <div className="td-cols">

            {/* My Courses */}
            <section className="td-section">
              <div className="td-section__header">
                <h2>My Courses</h2>
                <Link to="/dashboard/tutor/courses" className="td-section__link">View all</Link>
              </div>
              <div className="td-courses">
                {MY_COURSES.map(c => (
                  <div className="td-course-card" key={c.id}>
                    <div className="td-course-card__info">
                      <h4>{c.title}</h4>
                      <p>{c.students} students enrolled · ⭐ {c.rating}</p>
                    </div>
                    <div className="td-course-card__progress">
                      <div className="td-progress-label">
                        <span>Progress</span>
                        <span>{c.progress}%</span>
                      </div>
                      <div className="td-progress-bar">
                        <div className="td-progress-fill" style={{ width: `${c.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Reviews */}
            <section className="td-section">
              <div className="td-section__header">
                <h2>Recent Reviews</h2>
              </div>
              <div className="td-reviews">
                {RECENT_REVIEWS.map(r => (
                  <div className="td-review-card" key={r.id}>
                    <div className="td-review-card__top">
                      <div className="td-avatar td-avatar--sm">{r.avatar}</div>
                      <div>
                        <p className="td-review-card__name">{r.student}</p>
                        <p className="td-review-card__date">{r.date}</p>
                      </div>
                      <div className="td-review-card__stars">
                        {'⭐'.repeat(r.rating)}
                      </div>
                    </div>
                    <p className="td-review-card__comment">"{r.comment}"</p>
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

export default TutorDashboard