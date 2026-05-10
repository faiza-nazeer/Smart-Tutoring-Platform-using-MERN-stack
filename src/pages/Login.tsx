import './Login.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../api/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [tutorCount, setTutorCount] = useState(0)
  const [studentCount, setStudentCount] = useState(0)
  const [avgRating, setAvgRating] = useState(0)
  const navigate = useNavigate()
  const { login } = useAuth()


    useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then((data: any[]) => {

        const tutors = data.filter((user: any) => user.role === 'tutor')
        const students = data.filter((user: any) => user.role === 'student')

        setTutorCount(tutors.length)
        setStudentCount(students.length)

        const tutorsWithRating = tutors.filter(
          (tutor: any) => tutor.rating > 0
        )

        if (tutorsWithRating.length > 0) {
          const avg =
            tutorsWithRating.reduce(
              (sum: number, tutor: any) => sum + tutor.rating,
              0
            ) / tutorsWithRating.length

          setAvgRating(Math.round(avg * 10) / 10)
        }
      })
      .catch(err => console.error(err))
  }, [])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await loginUser(email, password)
      if (data.message) {
        setError(data.message)
        setLoading(false)
        return
      }
      login(data.user, data.token)
      if (data.user.role === 'tutor') navigate('/dashboard/tutor')
      else if (data.user.role === 'admin') navigate('/dashboard/admin')
      else navigate('/dashboard/student')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-container">

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
               <span className="login-left__stat-value">{tutorCount}+</span>
               <span className="login-left__stat-label">Tutors</span>
              </div>
              <div className="login-left__stat">
               <span className="login-left__stat-value">{studentCount}+</span>
                <span className="login-left__stat-label">Students</span>

              </div>
              <div className="login-left__stat">
                <span className="login-left__stat-value">{avgRating}★</span>
                <span className="login-left__stat-label">Rating</span>
              </div>
            </div>
          </div>
          <div className="login-left__circle login-left__circle--1"></div>
          <div className="login-left__circle login-left__circle--2"></div>
        </div>

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
                className="login-form__submit"
              >
                {loading ? 'Logging in...' : '🔐 Log In'}
              </button>

              

            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login