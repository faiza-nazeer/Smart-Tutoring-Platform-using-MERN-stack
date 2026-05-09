import './Signup.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../api/api'

type Role = 'student' | 'tutor'

function Signup() {
  const [role, setRole] = useState<Role>('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [subject, setSubject] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await registerUser({
        name,
        email,
        password,
        role,
        subject: role === 'tutor' ? subject : undefined,
      })
      if (data.message) {
        setError(data.message)
        setLoading(false)
        return
      }
      login(data.user, data.token)
      if (role === 'tutor') navigate('/dashboard/tutor')
      else navigate('/dashboard/student')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="signup-page">
      <Navbar />

      <div className="signup-container">

        {/* Left branding panel */}
        <div className="signup-left">
          <div className="signup-left__content">
            <div className="signup-left__logo">🎓 ETutor</div>
            <h2 className="signup-left__heading">
              Join thousands of<br />
              learners and tutors<br />
              on ETutor.
            </h2>
            <p className="signup-left__subtext">
              Create your free account today and start your
              journey — whether you're here to learn or teach.
            </p>

            <ul className="signup-left__benefits">
              <li className="signup-left__benefit">
                <span className="signup-left__benefit-icon">✓</span>
                Free to sign up, no credit card required
              </li>
              <li className="signup-left__benefit">
                <span className="signup-left__benefit-icon">✓</span>
                Access 500+ verified tutors across 20+ subjects
              </li>
              <li className="signup-left__benefit">
                <span className="signup-left__benefit-icon">✓</span>
                Flexible scheduling — learn or teach on your time
              </li>
              <li className="signup-left__benefit">
                <span className="signup-left__benefit-icon">✓</span>
                Tutors earn while doing what they love
              </li>
            </ul>
          </div>

          <div className="signup-left__circle signup-left__circle--1"></div>
          <div className="signup-left__circle signup-left__circle--2"></div>
        </div>

        {/* Right form panel */}
        <div className="signup-right">
          <div className="signup-form-wrap">
            <h1 className="signup-form__heading">Create Account</h1>
            <p className="signup-form__subtext">
              Already have an account?{' '}
              <a href="/login" className="signup-form__link">Log in</a>
            </p>

            <div className="signup-role">
              <p className="signup-role__label">I want to:</p>
              <div className="signup-role__toggle">
                <button
                  type="button"
                  className={`signup-role__btn ${role === 'student' ? 'signup-role__btn--active' : ''}`}
                  onClick={() => setRole('student')}
                >
                  🎒 Learn as a Student
                </button>
                <button
                  type="button"
                  className={`signup-role__btn ${role === 'tutor' ? 'signup-role__btn--active' : ''}`}
                  onClick={() => setRole('tutor')}
                >
                  📖 Teach as a Tutor
                </button>
              </div>
            </div>

            <form className="signup-form" onSubmit={handleSubmit}>

              <div className="signup-form__group">
                <label className="signup-form__label">
                  {role === 'student' ? 'Full name' : 'Your name'}
                </label>
                <input
                  type="text"
                  className="signup-form__input"
                  placeholder={role === 'student' ? 'e.g. Ahmed Khan' : 'e.g. Sara Raza'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="signup-form__group">
                <label className="signup-form__label">Email address</label>
                <input
                  type="email"
                  className="signup-form__input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="signup-form__group">
                <label className="signup-form__label">Password</label>
                <div className="signup-form__input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="signup-form__input"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="signup-form__eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {role === 'tutor' && (
                <div className="signup-form__group">
                  <label className="signup-form__label">Subject you teach</label>
                  <select
                    className="signup-form__input signup-form__select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                    <option>English</option>
                    <option>Computer Science</option>
                    <option>Urdu</option>
                    <option>Statistics</option>
                  </select>
                </div>
              )}

              {error && (
                <div style={{
                  background: '#fdecea', color: '#e74c3c',
                  padding: '0.75rem 1rem', borderRadius: 8,
                  fontSize: '0.88rem', fontWeight: 500
                }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="signup-form__submit"
              >
                {loading ? 'Creating account...' : (
                  role === 'student' ? 'Sign Up as Student' : 'Sign Up as Tutor'
                )}
              </button>

              <p className="signup-form__terms">
                By signing up you agree to our{' '}
                <a href="/terms" className="signup-form__link">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="signup-form__link">Privacy Policy</a>
              </p>

            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Signup