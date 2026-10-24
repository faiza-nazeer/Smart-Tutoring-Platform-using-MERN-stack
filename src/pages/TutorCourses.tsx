import { useEffect, useState } from 'react'
import { apiFetch } from '../api/api'
import { useAuth } from '../context/AuthContext'
import TutorLayout from '../components/TutorLayout'
import { asArray, averageRating, loadTutorReviews, money } from '../utils/tutor'
import './TutorCourses.css'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels']

type Form = { title: string; subject: string; level: string; price: string; description: string; status: string }

export default function TutorCourses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalError, setModalError] = useState('')
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const emptyForm = (): Form => ({
    title: '', subject: user?.subject || '', level: 'All Levels', price: '', description: '', status: 'Published',
  })
  const [form, setForm] = useState<Form>(emptyForm())

  useEffect(() => {
    if (!user?._id) return
    Promise.all([
      apiFetch('/courses').then(r => r.json()),
      loadTutorReviews(user._id),
    ])
      .then(([c, r]) => {
        setCourses(asArray(c).filter((x: any) => x.tutor?._id === user._id))
        setReviews(r)
      })
      .catch(() => setError('Could not load your courses. Please refresh.'))
      .finally(() => setLoading(false))
  }, [user?._id])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm())
    setModalError('')
    setShowModal(true)
  }

  const openEdit = (c: any) => {
    setEditingId(c._id)
    setForm({
      title: c.title || '', subject: c.subject || '', level: c.level || 'All Levels',
      price: String(c.price ?? ''), description: c.description || '', status: c.status || 'Draft',
    })
    setModalError('')
    setShowModal(true)
  }

  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  const save = async () => {
    if (!form.title.trim() || !form.subject.trim()) return setModalError('Title and subject are required.')
    const price = Number(form.price)
    if (!form.price || isNaN(price) || price <= 0) return setModalError('Enter a valid price greater than 0.')

    setSaving(true)
    setModalError('')
    const body = {
      title: form.title.trim(), subject: form.subject.trim(), level: form.level,
      price, description: form.description.trim(), status: form.status,
    }
    try {
      const res = await apiFetch(editingId ? `/courses/${editingId}` : '/courses', {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok || !data._id) {
        setModalError(data.message || 'Could not save the course.')
      } else {
        // the API returns the tutor as an id, so keep the shape the list expects
        const saved = { ...data, tutor: { _id: user._id } }
        setCourses(prev => (editingId ? prev.map(c => (c._id === editingId ? saved : c)) : [saved, ...prev]))
        setShowModal(false)
      }
    } catch {
      setModalError('Could not reach the server. Please try again.')
    }
    setSaving(false)
  }

  const toggleStatus = async (c: any) => {
    setError('')
    const status = c.status === 'Published' ? 'Draft' : 'Published'
    const res = await apiFetch(`/courses/${c._id}`, { method: 'PUT', body: JSON.stringify({ status }) })
    const data = await res.json()
    if (res.ok && data._id) setCourses(prev => prev.map(x => (x._id === c._id ? { ...x, status: data.status } : x)))
    else setError(data.message || 'Could not update the course.')
  }

  const remove = async (c: any) => {
    if (!window.confirm(`Delete "${c.title}"? This cannot be undone.`)) return
    setError('')
    const res = await apiFetch(`/courses/${c._id}`, { method: 'DELETE' })
    if (res.ok) setCourses(prev => prev.filter(x => x._id !== c._id))
    else setError((await res.json()).message || 'Could not delete the course.')
  }

  const published = courses.filter(c => c.status === 'Published').length
  const avg = averageRating(reviews)

  return (
    <TutorLayout flush>
      <div className="tc-page">
        <div className="tc-header">
          <div>
            <h1>My Courses</h1>
            <p>Create and manage the courses you teach</p>
          </div>
          <button className="tc-add-btn" onClick={openCreate}>+ Create Course</button>
        </div>

        {error && <div className="tx-error">{error}</div>}

        <div className="tc-stats">
          <div className="tc-stat"><strong>{courses.length}</strong><span>Total Courses</span></div>
          <div className="tc-stat"><strong>{published}</strong><span>Published</span></div>
          <div className="tc-stat"><strong>{courses.length - published}</strong><span>Drafts</span></div>
          <div className="tc-stat"><strong>{reviews.length ? avg.toFixed(1) : '—'}</strong><span>Your Rating</span></div>
        </div>

        {loading ? (
          <div className="tx-loading">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="tx-empty">
            <p>You haven't created any courses yet.</p>
            <button className="tc-add-btn" onClick={openCreate}>+ Create your first course</button>
          </div>
        ) : (
          <div className="tc-grid">
            {courses.map(c => (
              <div className="tc-card" key={c._id}>
                <div className="tc-card__top">
                  <div className="tc-card__icon">📚</div>
                  <div className="tc-card__title-wrap">
                    <h3>{c.title}</h3>
                    <span className={`tc-status ${c.status === 'Published' ? 'tc-status--active' : ''}`}>
                      {c.status === 'Published' ? '● Published' : c.status === 'Draft' ? '○ Draft (hidden)' : `● ${c.status}`}
                    </span>
                  </div>
                </div>

                <div className="tc-card__stats">
                  <div><strong>{money(c.price)}</strong><span>Per session</span></div>
                  <div><strong>{c.level || 'All Levels'}</strong><span>Level</span></div>
                  <div><strong>{c.subject}</strong><span>Subject</span></div>
                </div>

                {c.description && <p className="tc-desc">{c.description}</p>}

                <div className="tc-card__actions">
                  <button className="tc-btn-outline" onClick={() => openEdit(c)}>Edit</button>
                  <button className="tc-btn-outline" onClick={() => toggleStatus(c)}>
                    {c.status === 'Published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button className="tx-btn tx-btn--danger" onClick={() => remove(c)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="tc-modal-overlay" onClick={() => !saving && setShowModal(false)}>
            <div className="tc-modal" onClick={e => e.stopPropagation()}>
              <h2>{editingId ? 'Edit Course' : 'Create New Course'}</h2>
              {modalError && <div className="tx-error">{modalError}</div>}

              <div className="tc-modal-field">
                <label>Course Title</label>
                <input type="text" placeholder="e.g. Master Mathematics" value={form.title} onChange={set('title')} />
              </div>
              <div className="tc-modal-field">
                <label>Subject</label>
                <input type="text" placeholder="e.g. Mathematics" value={form.subject} onChange={set('subject')} />
              </div>
              <div className="tc-modal-field">
                <label>Level</label>
                <select value={form.level} onChange={set('level')}>
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="tc-modal-field">
                <label>Price per Session (Rs)</label>
                <input type="number" min="1" placeholder="e.g. 1500" value={form.price} onChange={set('price')} />
              </div>
              <div className="tc-modal-field">
                <label>Description</label>
                <textarea rows={3} maxLength={500} placeholder="What will students learn?" value={form.description} onChange={set('description')} />
              </div>
              <div className="tc-modal-field">
                <label>Visibility</label>
                <select value={form.status} onChange={set('status')}>
                  <option value="Published">Published (visible to students)</option>
                  <option value="Draft">Draft (hidden)</option>
                </select>
              </div>

              <div className="tc-modal-actions">
                <button className="tc-btn-outline" disabled={saving} onClick={() => setShowModal(false)}>Cancel</button>
                <button className="tc-btn-primary" disabled={saving} onClick={save}>
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TutorLayout>
  )
}
