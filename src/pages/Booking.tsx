import './Booking.css'
import Navbar from '../components/Navbar'
import { useState } from 'react'
import { createBooking } from '../api/api'

const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
const subjects = ['Algebra', 'Calculus', 'Statistics', 'Geometry', 'Trigonometry']

function Booking() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [sessionType, setSessionType] = useState<'online' | 'in-person'>('online')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime || !selectedSubject) return

    setLoading(true)
    try {
      await createBooking({
        // hardcoded for now until we add login
        student: '69ff363e4d4013ab41276b92',  // Ahmed Khan
        tutor: '69ff36df4d4013ab41276b93',    // Ayesha Khan
        subject: selectedSubject,
        date: selectedDate,
        time: selectedTime,
        sessionType: sessionType,
        duration: '1 hr',
        amount: 1500,
        notes: notes,
        status: 'Pending'
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div>
        <Navbar />
        <div className="booking">
          <div className="booking__success">
            <div className="booking__success-icon">🎉</div>
            <h2 className="booking__success-title">Booking Confirmed!</h2>
            <p className="booking__success-text">
              Your session with <strong>Ayesha Khan</strong> has been booked for{' '}
              <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong>.
            </p>
            <p className="booking__success-sub">A confirmation has been sent to your email.</p>
            <button className="booking__back-btn" onClick={() => setSubmitted(false)}>
              Book Another Session
            </button>
          </div>
        </div>
        <footer className="footer">
          <p>© 2024 eTutor. All rights reserved.</p>
        </footer>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="booking">
        <div className="booking__header">
          <h1 className="booking__title">Book a Session</h1>
          <p className="booking__subtitle">Schedule a 1-on-1 session with Ayesha Khan</p>
        </div>

        <div className="booking__layout">
          <form className="booking__form" onSubmit={handleSubmit}>

            <div className="booking__field">
              <label className="booking__label">Select Subject</label>
              <div className="booking__subject-grid">
                {subjects.map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`booking__subject-btn ${selectedSubject === s ? 'booking__subject-btn--active' : ''}`}
                    onClick={() => setSelectedSubject(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="booking__field">
              <label className="booking__label">Session Type</label>
              <div className="booking__type-toggle">
                <button
                  type="button"
                  className={`booking__type-btn ${sessionType === 'online' ? 'booking__type-btn--active' : ''}`}
                  onClick={() => setSessionType('online')}
                >
                  🎥 Online
                </button>
                <button
                  type="button"
                  className={`booking__type-btn ${sessionType === 'in-person' ? 'booking__type-btn--active' : ''}`}
                  onClick={() => setSessionType('in-person')}
                >
                  🏫 In-Person
                </button>
              </div>
            </div>

            <div className="booking__field">
              <label className="booking__label" htmlFor="date">Select Date</label>
              <input
                id="date"
                type="date"
                className="booking__input"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="booking__field">
              <label className="booking__label">Select Time</label>
              <div className="booking__time-grid">
                {timeSlots.map(t => (
                  <button
                    key={t}
                    type="button"
                    className={`booking__time-btn ${selectedTime === t ? 'booking__time-btn--active' : ''}`}
                    onClick={() => setSelectedTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="booking__field">
              <label className="booking__label" htmlFor="notes">Additional Notes (optional)</label>
              <textarea
                id="notes"
                className="booking__textarea"
                placeholder="Topics you'd like to cover, questions, or special requests..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <button type="submit" className="booking__submit-btn" disabled={loading}>
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>

          <div className="booking__summary">
            <h3 className="booking__summary-title">Booking Summary</h3>
            <div className="booking__summary-tutor">
              <div className="booking__summary-avatar">👩‍🏫</div>
              <div>
                <p className="booking__summary-name">Ayesha Khan</p>
                <p className="booking__summary-role">Mathematics Tutor</p>
              </div>
            </div>
            <div className="booking__summary-details">
              <div className="booking__summary-row">
                <span className="booking__summary-key">Subject</span>
                <span className="booking__summary-val">{selectedSubject || '—'}</span>
              </div>
              <div className="booking__summary-row">
                <span className="booking__summary-key">Type</span>
                <span className="booking__summary-val" style={{ textTransform: 'capitalize' }}>{sessionType}</span>
              </div>
              <div className="booking__summary-row">
                <span className="booking__summary-key">Date</span>
                <span className="booking__summary-val">{selectedDate || '—'}</span>
              </div>
              <div className="booking__summary-row">
                <span className="booking__summary-key">Time</span>
                <span className="booking__summary-val">{selectedTime || '—'}</span>
              </div>
              <div className="booking__summary-row booking__summary-row--total">
                <span className="booking__summary-key">Total</span>
                <span className="booking__summary-total">Rs 1,500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer">
        <p>© 2024 eTutor. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Booking