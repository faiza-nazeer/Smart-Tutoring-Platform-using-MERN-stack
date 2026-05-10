import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { forgotPassword } from '../api/api'

function ForgotPassword() {
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:5000/api/users')
      const users = await res.json()
      const exists = users.find((u: any) => u.email === email)
      if (!exists) {
        setError('No account found with this email address')
      } else {
        setStep(2)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      const data = await forgotPassword(email, newPassword)
      if (data.message === 'Password updated successfully') {
        setSuccess(true)
      } else {
        setError(data.message || 'Something went wrong')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 60px)', padding: '2rem'
      }}>
        <div style={{
          background: 'white', borderRadius: 16, padding: '2.5rem',
          width: '100%', maxWidth: 440,
          boxShadow: '0 4px 32px rgba(108,99,255,0.1)'
        }}>

          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ color: 'var(--dark)', marginBottom: '0.5rem' }}>Password Reset!</h2>
              <p style={{ color: 'var(--gray)', marginBottom: '1.5rem' }}>
                Your password has been updated successfully.
              </p>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'var(--purple)', color: 'white', border: 'none',
                  padding: '0.75rem 2rem', borderRadius: 8, fontWeight: 600,
                  cursor: 'pointer', fontSize: '0.95rem'
                }}
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--dark)', marginBottom: '0.5rem' }}>
                  {step === 1 ? '🔐 Forgot Password' : '🔑 Reset Password'}
                </h1>
                <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
                  {step === 1
                    ? 'Enter your email address to reset your password'
                    : `Setting new password for ${email}`}
                </p>
              </div>

              {/* Step indicator */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {[1, 2].map(s => (
                  <div key={s} style={{
                    flex: 1, height: 4, borderRadius: 4,
                    background: s <= step ? 'var(--purple)' : '#e0e0e0'
                  }} />
                ))}
              </div>

              {step === 1 ? (
                <form onSubmit={handleCheckEmail}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark)', display: 'block', marginBottom: '0.4rem' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      style={{
                        width: '100%', padding: '0.75rem 1rem',
                        border: '1.5px solid #e0e0e0', borderRadius: 8,
                        fontSize: '0.95rem', outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {error && (
                    <div style={{
                      background: '#fdecea', color: '#e74c3c',
                      padding: '0.75rem', borderRadius: 8,
                      fontSize: '0.88rem', marginBottom: '1rem'
                    }}>
                      ⚠️ {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%', padding: '0.85rem',
                      background: 'var(--purple)', color: 'white',
                      border: 'none', borderRadius: 8, fontWeight: 700,
                      fontSize: '0.95rem', cursor: 'pointer'
                    }}
                  >
                    {loading ? 'Checking...' : 'Continue →'}
                  </button>

                  <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.88rem', color: 'var(--gray)' }}>
                    Remember your password?{' '}
                    <a href="/login" style={{ color: 'var(--purple)', fontWeight: 600 }}>Log in</a>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark)', display: 'block', marginBottom: '0.4rem' }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      style={{
                        width: '100%', padding: '0.75rem 1rem',
                        border: '1.5px solid #e0e0e0', borderRadius: 8,
                        fontSize: '0.95rem', outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark)', display: 'block', marginBottom: '0.4rem' }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Repeat your new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      style={{
                        width: '100%', padding: '0.75rem 1rem',
                        border: '1.5px solid #e0e0e0', borderRadius: 8,
                        fontSize: '0.95rem', outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {error && (
                    <div style={{
                      background: '#fdecea', color: '#e74c3c',
                      padding: '0.75rem', borderRadius: 8,
                      fontSize: '0.88rem', marginBottom: '1rem'
                    }}>
                      ⚠️ {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%', padding: '0.85rem',
                      background: 'var(--orange)', color: 'white',
                      border: 'none', borderRadius: 8, fontWeight: 700,
                      fontSize: '0.95rem', cursor: 'pointer'
                    }}
                  >
                    {loading ? 'Resetting...' : '🔑 Reset Password'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(''); }}
                    style={{
                      width: '100%', padding: '0.75rem',
                      background: 'transparent', color: 'var(--gray)',
                      border: '1.5px solid #e0e0e0', borderRadius: 8,
                      fontWeight: 600, fontSize: '0.9rem',
                      cursor: 'pointer', marginTop: '0.5rem'
                    }}
                  >
                    ← Back
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword