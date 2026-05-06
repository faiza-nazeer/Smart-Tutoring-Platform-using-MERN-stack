// StudentDashboard.tsx
// What a student sees after logging in
import './StudentDashboard.css'
import Navbar from '../components/Navbar'

// Dummy data — replace with API calls later
const STUDENT = { name: 'Ahmed Khan', email: 'ahmed@email.com', avatar: 'AK', joinedDate: 'Jan 2025' }

const UPCOMING_SESSIONS = [
  { id: 1, tutor: 'Ayesha Khan', subject: 'Mathematics', date: 'Today', time: '5:00 PM', duration: '1 hr', avatar: 'AK', status: 'upcoming' },
  { id: 2, tutor: 'Zain Ahmed', subject: 'Physics', date: 'Tomorrow', time: '4:00 PM', duration: '1 hr', avatar: 'ZA', status: 'upcoming' },
  { id: 3, tutor: 'Sara Raza', subject: 'English', date: 'Sat, 30 Apr', time: '3:00 PM', duration: '1 hr', avatar: 'SR', status: 'upcoming' },
]

const ENROLLED_COURSES = [
  { id: 1, title: 'Master Mathematics', tutor: 'Ayesha Khan', subject: 'Mathematics', progress: 65, avatar: 'AK' },
  { id: 2, title: 'Physics for Intermediate', tutor: 'Zain Ahmed', subject: 'Physics', progress: 40, avatar: 'ZA' },
  { id: 3, title: 'English Grammar Masterclass', tutor: 'Sara Raza', subject: 'English', progress: 80, avatar: 'SR' },
]

const STATS = [
  { label: 'Sessions Completed', value: '12', icon: '✅' },
  { label: 'Hours Learned', value: '18', icon: '⏱️' },
  { label: 'Courses Enrolled', value: '3', icon: '📚' },
  { label: 'Avg Rating Given', value: '4.8', icon: '⭐' },
]

function StudentDashboard() {
  return (
    <div className="sd-page">
      <Navbar />

      <div className="sd-body">

        {/* Sidebar */}
        <aside className="sd-sidebar">
          <div className="sd-profile">
            <div className="sd-profile__avatar">{STUDENT.avatar}</div>
            <p className="sd-profile__name">{STUDENT.name}</p>
            <p className="sd-profile__email">{STUDENT.email}</p>
            <span className="sd-profile__badge">Student</span>
          </div>

          <nav className="sd-nav">
            <a href="#" className="sd-nav__link sd-nav__link--active">🏠 Dashboard</a>
            <a href="#" className="sd-nav__link">📚 My Courses</a>
            <a href="#" className="sd-nav__link">📅 My Sessions</a>
            <a href="/courses" className="sd-nav__link">🔍 Find Tutors</a>
            <a href="#" className="sd-nav__link">👤 My Profile</a>
            <a href="#" className="sd-nav__link">⚙️ Settings</a>
          </nav>

          <button className="sd-logout-btn">Log Out</button>
        </aside>

        {/* Main content */}
        <main className="sd-main">

          {/* Welcome header */}
          <div className="sd-welcome">
            <div>
              <h1 className="sd-welcome__heading">Welcome back, {STUDENT.name.split(' ')[0]}! 👋</h1>
              <p className="sd-welcome__sub">Here's what's happening with your learning today.</p>
            </div>
            <a href="/courses" className="sd-find-tutor-btn">+ Find a Tutor</a>
          </div>

          {/* Stats row */}
          <div className="sd-stats-row">
            {STATS.map(stat => (
              <div className="sd-stat-card" key={stat.label}>
                <span className="sd-stat-card__icon">{stat.icon}</span>
                <span className="sd-stat-card__value">{stat.value}</span>
                <span className="sd-stat-card__label">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Two column layout */}
          <div className="sd-cols">

            {/* Upcoming sessions */}
            <section className="sd-section">
              <div className="sd-section__header">
                <h2 className="sd-section__heading">Upcoming Sessions</h2>
                <a href="#" className="sd-section__link">View all</a>
              </div>
              <div className="sd-sessions">
                {UPCOMING_SESSIONS.map(s => (
                  <div className="sd-session-card" key={s.id}>
                    <div className="sd-session-card__avatar">{s.avatar}</div>
                    <div className="sd-session-card__info">
                      <p className="sd-session-card__tutor">{s.tutor}</p>
                      <p className="sd-session-card__subject">{s.subject}</p>
                    </div>
                    <div className="sd-session-card__time">
                      <p className="sd-session-card__date">{s.date}</p>
                      <p className="sd-session-card__clock">{s.time} · {s.duration}</p>
                    </div>
                    <button className="sd-session-card__join-btn">Join</button>
                  </div>
                ))}
              </div>
            </section>

            {/* Enrolled courses */}
            <section className="sd-section">
              <div className="sd-section__header">
                <h2 className="sd-section__heading">My Courses</h2>
                <a href="#" className="sd-section__link">View all</a>
              </div>
              <div className="sd-courses">
                {ENROLLED_COURSES.map(c => (
                  <div className="sd-course-card" key={c.id}>
                    <div className="sd-course-card__left">
                      <div className="sd-course-card__avatar">{c.avatar}</div>
                      <div>
                        <p className="sd-course-card__title">{c.title}</p>
                        <p className="sd-course-card__tutor">{c.tutor} · {c.subject}</p>
                      </div>
                    </div>
                    <div className="sd-course-card__progress-wrap">
                      <div className="sd-progress-bar">
                        <div
                          className="sd-progress-bar__fill"
                          style={{ width: `${c.progress}%` }}
                        ></div>
                      </div>
                      <p className="sd-course-card__progress-text">{c.progress}% complete</p>
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