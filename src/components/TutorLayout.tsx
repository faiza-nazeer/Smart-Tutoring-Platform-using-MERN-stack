import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { initials } from '../utils/tutor'
import '../pages/TutorDashboard.css'
import '../pages/TutorExtras.css'

const navLinks = [
  { to: '/dashboard/tutor', label: '🏠 Dashboard' },
  { to: '/dashboard/tutor/sessions', label: '📅 My Sessions' },
  { to: '/dashboard/tutor/courses', label: '📚 My Courses' },
  { to: '/dashboard/tutor/students', label: '👨‍🎓 My Students' },
  { to: '/dashboard/tutor/earnings', label: '💰 Earnings' },
  { to: '/dashboard/tutor/reviews', label: '⭐ Reviews' },
  { to: '/dashboard/tutor/profile', label: '👤 My Profile' },
]

// Sidebar + content frame used by every page in the tutor area.
export default function TutorLayout({
  children,
  flush = false,
}: {
  children: React.ReactNode
  flush?: boolean // sub-pages bring their own padding
}) {
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <div className="td-page">
      <div className="td-body">
        <aside className="td-sidebar">
          <Link to="/" className="td-logo" style={{ textDecoration: 'none' }}>🎓 ETutor</Link>

          <div className="td-profile">
            <div className="td-profile__avatar">{initials(user?.name)}</div>
            <p className="td-profile__name">{user?.name || 'Tutor'}</p>
            <p className="td-profile__subject">{user?.subject ? `${user.subject} Tutor` : 'Tutor'}</p>
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
            onClick={() => { logout(); window.location.href = '/login' }}
          >
            Log Out
          </button>
        </aside>

        <main className={`td-main ${flush ? 'td-main--flush' : ''}`}>{children}</main>
      </div>
    </div>
  )
}
