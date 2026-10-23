import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

// Resetting a password with only an email address would let anyone take over any account,
// so password reset is not offered until it can be done via an emailed one-time link.
function ForgotPassword() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 60px)', padding: '2rem'
      }}>
        <div style={{
          background: 'white', borderRadius: 16, padding: '2.5rem',
          width: '100%', maxWidth: 440, textAlign: 'center',
          boxShadow: '0 4px 32px rgba(108,99,255,0.1)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔑</div>
          <h2 style={{ marginTop: 0 }}>Forgot your password?</h2>
          <p style={{ color: '#666', lineHeight: 1.6 }}>
            Self-service password reset isn't available yet. Please{' '}
            <Link to="/contact">contact us</Link> and we'll help you get back into your account.
          </p>
          <Link to="/login" style={{ fontWeight: 600 }}>← Back to login</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
