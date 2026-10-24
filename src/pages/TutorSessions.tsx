import { useEffect, useState } from 'react'
import { updateBooking } from '../api/api'
import TutorLayout from '../components/TutorLayout'
import { fmtDate, initials, loadMyBookings, money } from '../utils/tutor'
import './TutorSessions.css'

type Tab = 'upcoming' | 'completed' | 'cancelled'

const TABS: Record<Tab, { label: string; statuses: string[] }> = {
  upcoming: { label: 'Upcoming', statuses: ['Pending', 'Confirmed'] },
  completed: { label: 'Completed', statuses: ['Completed'] },
  cancelled: { label: 'Cancelled', statuses: ['Cancelled'] },
}

const badgeFor = (status: string) =>
  status === 'Completed' ? 'badge-done' : status === 'Cancelled' ? 'badge-cancelled' : 'badge-upcoming'

export default function TutorSessions() {
  const [bookings, setBookings] = useState<any[]>([])
  const [tab, setTab] = useState<Tab>('upcoming')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  useEffect(() => {
    loadMyBookings()
      .then(setBookings)
      .catch(() => setError('Could not load sessions. Please refresh.'))
      .finally(() => setLoading(false))
  }, [])

  const changeStatus = async (id: string, status: string) => {
    if (status === 'Cancelled' && !window.confirm('Cancel this session?')) return
    setBusyId(id)
    setError('')
    const data = await updateBooking(id, { status })
    if (data?._id) {
      setBookings(prev => prev.map(b => (b._id === id ? { ...b, status: data.status } : b)))
    } else {
      setError(data?.message || 'Could not update the session.')
    }
    setBusyId('')
  }

  const inTab = (t: Tab) => bookings.filter(b => TABS[t].statuses.includes(b.status))
  const sortFor = (t: Tab) => (a: any, b: any) =>
    t === 'upcoming'
      ? `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
      : `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)
  const list = inTab(tab).sort(sortFor(tab))
  const pending = bookings.filter(b => b.status === 'Pending').length

  return (
    <TutorLayout flush>
      <div className="ts-page">
        <div className="ts-header">
          <div>
            <h1>My Sessions</h1>
            <p>Accept requests and manage your tutoring sessions</p>
          </div>
          <div className="ts-stats-mini">
            <div><strong>{pending}</strong><span>Awaiting You</span></div>
            <div><strong>{inTab('upcoming').length}</strong><span>Upcoming</span></div>
            <div><strong>{inTab('completed').length}</strong><span>Completed</span></div>
          </div>
        </div>

        {error && <div className="tx-error">{error}</div>}

        <div className="ts-tabs">
          {(Object.keys(TABS) as Tab[]).map(t => (
            <button key={t} className={`ts-tab ${tab === t ? 'ts-tab--active' : ''}`} onClick={() => setTab(t)}>
              {TABS[t].label}
              <span className="ts-tab-count">{inTab(t).length}</span>
            </button>
          ))}
        </div>

        <div className="ts-list">
          {loading ? (
            <div className="tx-loading">Loading sessions...</div>
          ) : list.length === 0 ? (
            <div className="ts-empty">No {tab} sessions.</div>
          ) : (
            list.map(s => (
              <div className="ts-card" key={s._id}>
                <div className="ts-avatar">{initials(s.student?.name)}</div>
                <div className="ts-card__info">
                  <h4>{s.student?.name || 'Student'}</h4>
                  <p>{s.subject} · {s.sessionType === 'in-person' ? 'In person' : 'Online'} · {money(s.amount)}</p>
                  {s.student?.email && <a className="tx-link" href={`mailto:${s.student.email}`}>{s.student.email}</a>}
                  {s.notes && <p className="tx-note">📝 {s.notes}</p>}
                </div>
                <div className="ts-card__time">
                  <span className="ts-date">{fmtDate(s.date)}</span>
                  <span>{s.time}{s.duration ? ` · ${s.duration}` : ''}</span>
                </div>
                <span className={`ts-badge ${badgeFor(s.status)}`}>{s.status}</span>
                <div className="tx-actions">
                  {s.status === 'Pending' && (
                    <>
                      <button className="tx-btn tx-btn--green" disabled={busyId === s._id} onClick={() => changeStatus(s._id, 'Confirmed')}>Accept</button>
                      <button className="tx-btn tx-btn--danger" disabled={busyId === s._id} onClick={() => changeStatus(s._id, 'Cancelled')}>Decline</button>
                    </>
                  )}
                  {s.status === 'Confirmed' && (
                    <>
                      <button className="tx-btn" disabled={busyId === s._id} onClick={() => changeStatus(s._id, 'Completed')}>Mark Completed</button>
                      <button className="tx-btn tx-btn--danger" disabled={busyId === s._id} onClick={() => changeStatus(s._id, 'Cancelled')}>Cancel</button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </TutorLayout>
  )
}
