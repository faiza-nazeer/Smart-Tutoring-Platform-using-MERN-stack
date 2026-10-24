import { useEffect, useState } from 'react'
import { getUser, updateUser as saveUser } from '../api/api'
import { useAuth } from '../context/AuthContext'
import TutorLayout from '../components/TutorLayout'

export default function TutorProfileEdit() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({ name: '', phone: '', city: '', subject: '', price: '', bio: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user?._id) return
    getUser(user._id)
      .then(u => setForm({
        name: u.name || '', phone: u.phone || '', city: u.city || '', subject: u.subject || '',
        price: u.price ? String(u.price) : '', bio: u.bio || '',
      }))
      .catch(() => setError('Could not load your profile.'))
      .finally(() => setLoading(false))
  }, [user?._id])

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSaved(false)
    setForm(prev => ({ ...prev, [key]: e.target.value }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Name is required.')
    const price = form.price === '' ? 0 : Number(form.price)
    if (isNaN(price) || price < 0) return setError('Enter a valid price.')

    setSaving(true)
    const data = await saveUser(user._id, {
      name: form.name.trim(), phone: form.phone.trim(), city: form.city.trim(),
      subject: form.subject.trim(), price, bio: form.bio.trim(),
    })
    if (data?._id) {
      updateUser({ name: data.name, city: data.city, subject: data.subject, price: data.price })
      setSaved(true)
    } else {
      setError(data?.message || 'Could not save your profile.')
    }
    setSaving(false)
  }

  return (
    <TutorLayout flush>
      <div style={{ padding: '2rem' }}>
        <h1>My Profile</h1>
        <p className="tx-note" style={{ marginBottom: '1.5rem' }}>
          This is what students see when they browse tutors. Your price is used for new bookings.
        </p>

        {loading ? (
          <div className="tx-loading">Loading profile...</div>
        ) : (
          <form className="tx-form-card" onSubmit={submit}>
            {error && <div className="tx-error">{error}</div>}
            {saved && <div className="tx-success">Profile updated.</div>}

            <div className="tx-row">
              <div className="tx-field">
                <label>Full name</label>
                <input value={form.name} onChange={set('name')} />
              </div>
              <div className="tx-field">
                <label>Phone</label>
                <input value={form.phone} onChange={set('phone')} />
              </div>
            </div>
            <div className="tx-row">
              <div className="tx-field">
                <label>Subject you teach</label>
                <input value={form.subject} onChange={set('subject')} placeholder="e.g. Mathematics" />
              </div>
              <div className="tx-field">
                <label>City</label>
                <input value={form.city} onChange={set('city')} />
              </div>
            </div>
            <div className="tx-field">
              <label>Price per session (Rs)</label>
              <input type="number" min="0" value={form.price} onChange={set('price')} />
            </div>
            <div className="tx-field">
              <label>About you</label>
              <textarea rows={5} maxLength={600} value={form.bio} onChange={set('bio')} placeholder="Your experience and teaching style" />
            </div>
            <button className="tx-btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </form>
        )}
      </div>
    </TutorLayout>
  )
}
