import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function NotFound() {
  return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <h1 style={{ fontSize: '3rem', margin: 0 }}>404</h1>
        <p>We couldn't find that page.</p>
        <Link to="/">← Back to home</Link>
      </div>
    </div>
  )
}
