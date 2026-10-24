import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import TutorLayout from '../components/TutorLayout'
import { fmtDate, initials, isUpcoming, loadMyBookings, loadTutorReviews } from '../utils/tutor'
import './TutorStudents.css'

export default function TutorStudents() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?._id) return
    Promise.all([loadMyBookings(), loadTutorReviews(user._id)])
      .then(([b, r]) => { setBookings(b); setReviews(r) })
      .catch(() => setError('Could not load your students. Please refresh.'))
      .finally(() => setLoading(false))
  }, [user?._id])

  // One entry per student, built from their bookings with this tutor.
  const byStudent = new Map<string, any>()
  for (const b of bookings.filter(x => x.status !== 'Cancelled' && x.student?._id)) {
    const entry = byStudent.get(b.student._id) || {
      id: b.student._id, name: b.student.name, email: b.student.email,
      subjects: new Set<string>(), completed: 0, upcoming: 0, last: '',
    }
    entry.subjects.add(b.subject)
    if (b.status === 'Completed') entry.completed += 1
    if (isUpcoming(b)) entry.upcoming += 1
    if (b.date > entry.last) entry.last = b.date
    byStudent.set(b.student._id, entry)
  }
  const students = [...byStudent.values()].sort((a, b) => b.last.localeCompare(a.last))
  const ratingFor = (id: string) => reviews.find(r => r.student?._id === id)?.rating

  return (
    <TutorLayout flush>
      <div className="tstu-page">
        <div className="tstu-header">
          <div>
            <h1>My Students</h1>
            <p>Students who have booked sessions with you</p>
          </div>
          <div className="tstu-stats-mini">
            <div><strong>{students.length}</strong><span>Total Students</span></div>
            <div><strong>{students.filter(s => s.upcoming > 0).length}</strong><span>With Upcoming</span></div>
          </div>
        </div>

        {error && <div className="tx-error">{error}</div>}

        {loading ? (
          <div className="tx-loading">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="tx-empty">No students yet. They will appear here once someone books a session with you.</div>
        ) : (
          <div className="tstu-grid">
            {students.map(s => {
              const rating = ratingFor(s.id)
              return (
                <div className="tstu-card" key={s.id}>
                  <div className="tstu-card__top">
                    <div className="tstu-avatar">{initials(s.name)}</div>
                    <div className="tstu-card__info">
                      <h3>{s.name}</h3>
                      <p>{[...s.subjects].join(', ')}</p>
                    </div>
                    {s.upcoming > 0 && <span className="tx-badge tx-badge--pending">{s.upcoming} upcoming</span>}
                  </div>

                  <div className="tstu-card__footer">
                    <span>✅ {s.completed} completed</span>
                    <span>{rating ? '⭐'.repeat(rating) : 'Not reviewed'}</span>
                  </div>
                  <p className="tx-note">Last session: {fmtDate(s.last)}</p>

                  <div className="tstu-card__actions">
                    {s.email && <a className="tstu-btn-primary" style={{ textDecoration: 'none', textAlign: 'center' }} href={`mailto:${s.email}`}>✉ Email</a>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </TutorLayout>
  )
}
