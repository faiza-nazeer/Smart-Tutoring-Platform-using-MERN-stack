// Navbar.tsx
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <span className="navbar__logo-icon">🎓</span>
        <span className="navbar__logo-text">ETutor</span>
      </div>

      <ul className="navbar__links">
        <li><Link to="/" className={`navbar__link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link></li>
        <li><Link to="/about" className="navbar__link">About</Link></li>
        <li><Link to="/courses" className="navbar__link">Courses</Link></li>
        <li><Link to="/success" className="navbar__link">Success</Link></li>
        <li><Link to="/contact" className="navbar__link">Contact</Link></li>
      </ul>

      <div className="navbar__auth">
        <Link to="/login" className="navbar__login">Log In</Link>
        <Link to="/signup" className="navbar__signup">Sign Up</Link>
      </div>
    </nav>
  )
}

export default Navbar