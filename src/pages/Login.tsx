// Login.tsx
import './Login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: connect to backend login API
    // When backend is ready, check role from response and navigate accordingly
    navigate('/dashboard/student')
  }

  return (
    <div className="login-page">
      <Navbar />

      <div className="login-container">

        {/* Left side — purple branding panel */}
        <div className="login-left">
          <div className="login-left__content">
            <div className="login-left__logo">🎓 ETutor</div>
            <h2 className="login-left__heading">
              Welcome back!<br />
              Ready to continue<br />
              your journey?
            </h2>
            <p className="login-left__subtext">
              Log in to access your dashboard, sessions,
              courses, and everything ETutor has to offer.
            </p>

            <div className="login-left__stats">
              <div className="login-left__stat">
                <span className="login-left__stat-value">500+</span>
                <span className="login-left__stat-label">Tutors</span>
              </div>
              <div className="login-left__stat">
                <span className="login-left__stat-value">10K+</span>
                <span className="login-left__stat-label">Students</span>
              </div>
              <div className="login-left__stat">
                <span className="login-left__stat-value">4.8★</span>
                <span className="login-left__stat-label">Rating</span>
              </div>
            </div>
          </div>

          <div className="login-left__circle login-left__circle--1"></div>
          <div className="login-left__circle login-left__circle--2"></div>
        </div>

        {/* Right side — login form */}
        <div className="login-right">
          <div className="login-form-wrap">
            <h1 className="login-form__heading">Log In</h1>
            <p className="login-form__subtext">
              Don't have an account?{' '}
              <a href="/signup" className="login-form__link">Sign up for free</a>
            </p>

            <form className="login-form" onSubmit={handleSubmit}>

              <div className="login-form__group">
                <label className="login-form__label">Email address</label>
                <input
                  type="email"
                  className="login-form__input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-form__group">
                <div className="login-form__label-row">
                  <label className="login-form__label">Password</label>
                  <a href="/forgot-password" className="login-form__forgot">
                    Forgot password?
                  </a>
                </div>
                <div className="login-form__input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="login-form__input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="login-form__eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-form__submit">
                Log In
              </button>

              <div className="login-form__divider">
                <span>or continue with</span>
              </div>

              <div className="login-form__socials">
                <button type="button" className="login-form__social-btn">
                  <span>G</span> Google
                </button>
                <button type="button" className="login-form__social-btn">
                  <span>f</span> Facebook
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login