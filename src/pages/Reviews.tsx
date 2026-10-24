import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiFetch, createReview, getUser } from '../api/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import TutorLayout from '../components/TutorLayout'
import { averageRating, initials, loadMyBookings, loadTutorReviews } from '../utils/tutor'
import './Reviews.css'

function StarRating({ value, onChange, readonly = false }: {
  value: number
  onChange?: (v: number) => void
  readonly?: boolean
}) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="star-row">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`star ${star <= (hovered || value) ? 'star--filled' : ''} ${!readonly ? 'star--interactive' : ''}`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
        >
          ★
        </span>
      ))}
    </div>
  )
}

const ratingLabel = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

// Used in two places:
//  /tutor/:id/reviews        -> public page for one tutor (students can review after a completed session)
//  /dashboard/tutor/reviews  -> the logged-in tutor's own reviews (they can reply)
export default function Reviews() {
  const { id } = useParams()
  const { user } = useAuth()
  const ownDashboard = !id
  const tutorId: string | undefined = id || user?._id

  const [tutor, setTutor] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterRating, setFilter] = useState(0)
  const [sortBy, setSort] = useState<'recent' | 'highest' | 'lowest'>('recent')

  // write-a-review (students)
  const [canReview, setCanReview] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  // reply (tutor)
  const [replyingId, setReplyingId] = useState('')
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    if (!tutorId) return
    Promise.all([getUser(tutorId), loadTutorReviews(tutorId)])
      .then(([t, r]) => {
        setTutor(t?._id ? t : null)
        setReviews(r)
      })
      .catch(() => setError('Could not load reviews. Please refresh.'))
      .finally(() => setLoading(false))
  }, [tutorId])

  // A student may review once, and only after a completed session with this tutor.
  useEffect(() => {
    if (!tutorId || user?.role !== 'student') return
    loadMyBookings()
      .then(bookings => setCanReview(bookings.some(b => b.tutor?._id === tutorId && b.status === 'Completed')))
      .catch(() => setCanReview(false))
  }, [tutorId, user?.role])

  const alreadyReviewed = reviews.some(r => r.student?._id === user?._id)
  const avg = averageRating(reviews)
  const breakdown = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length
    return { stars, count, percent: reviews.length ? Math.round((count / reviews.length) * 100) : 0 }
  })

  const filtered = reviews
    .filter(r => filterRating === 0 || r.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating
      if (sortBy === 'lowest') return a.rating - b.rating
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const submitReview = async () => {
    setFormError('')
    setSubmitting(true)
    const data = await createReview({ tutor: tutorId, rating: newRating, comment: newComment.trim() })
    if (data?._id) {
      setReviews(prev => [{ ...data, student: { _id: user._id, name: user.name } }, ...prev])
      setShowForm(false)
      setNewRating(0)
      setNewComment('')
    } else {
      setFormError(data?.message || 'Could not submit your review.')
    }
    setSubmitting(false)
  }

  const submitReply = async (reviewId: string) => {
    setError('')
    const res = await apiFetch(`/reviews/${reviewId}/reply`, { method: 'PUT', body: JSON.stringify({ reply: replyText }) })
    const data = await res.json()
    if (res.ok && data._id) {
      setReviews(prev => prev.map(r => (r._id === reviewId ? { ...r, tutorReply: data.tutorReply } : r)))
      setReplyingId('')
      setReplyText('')
    } else {
      setError(data.message || 'Could not save your reply.')
    }
  }

  const content = (
    <div className="rv-page">
      <div className="rv-header">
        <div>
          <h1>Ratings & Reviews</h1>
          <p>{tutor ? `${tutor.name}${tutor.subject ? ` · ${tutor.subject} Tutor` : ''}` : ownDashboard ? 'Your reviews' : ''}</p>
        </div>
        {user?.role === 'student' && canReview && !alreadyReviewed && (
          <button className="rv-write-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '✎ Write a Review'}
          </button>
        )}
      </div>

      {error && <div className="tx-error">{error}</div>}

      {loading ? (
        <div className="tx-loading">Loading reviews...</div>
      ) : (
        <>
          <div className="rv-summary">
            <div className="rv-summary__score">
              <span className="rv-big-rating">{reviews.length ? avg.toFixed(1) : '—'}</span>
              <StarRating value={Math.round(avg)} readonly />
              <span className="rv-total">{reviews.length} review{reviews.length === 1 ? '' : 's'}</span>
            </div>

            <div className="rv-summary__breakdown">
              {breakdown.map(b => (
                <div
                  key={b.stars}
                  className={`rv-breakdown-row ${filterRating === b.stars ? 'rv-breakdown-row--active' : ''}`}
                  onClick={() => setFilter(filterRating === b.stars ? 0 : b.stars)}
                >
                  <span className="rv-breakdown-label">{b.stars} ★</span>
                  <div className="rv-breakdown-bar">
                    <div className="rv-breakdown-fill" style={{ width: `${b.percent}%` }} />
                  </div>
                  <span className="rv-breakdown-count">{b.count}</span>
                </div>
              ))}
            </div>
          </div>

          {showForm && (
            <div className="rv-form">
              <h2>Write Your Review</h2>
              {formError && <div className="tx-error">{formError}</div>}
              <div className="rv-form__group">
                <label>Your Rating</label>
                <div className="rv-form__rating">
                  <StarRating value={newRating} onChange={setNewRating} />
                  {newRating > 0 && <span className="rv-rating-label">{ratingLabel[newRating]}</span>}
                </div>
              </div>
              <div className="rv-form__group">
                <label>Your Review</label>
                <textarea
                  placeholder="Share your experience with this tutor..."
                  value={newComment}
                  maxLength={500}
                  onChange={e => setNewComment(e.target.value)}
                  rows={4}
                />
                <span className="rv-char-count">{newComment.length} / 500</span>
              </div>
              <button className="rv-submit-btn" onClick={submitReview} disabled={!newRating || !newComment.trim() || submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          )}

          <div className="rv-controls">
            <div className="rv-filter-chips">
              <button className={`rv-chip ${filterRating === 0 ? 'rv-chip--active' : ''}`} onClick={() => setFilter(0)}>
                All ({reviews.length})
              </button>
              {[5, 4, 3, 2, 1].map(r => (
                <button
                  key={r}
                  className={`rv-chip ${filterRating === r ? 'rv-chip--active' : ''}`}
                  onClick={() => setFilter(filterRating === r ? 0 : r)}
                >
                  {r} ★ ({reviews.filter(rv => rv.rating === r).length})
                </button>
              ))}
            </div>
            <select className="rv-sort" value={sortBy} onChange={e => setSort(e.target.value as typeof sortBy)}>
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>

          <div className="rv-list">
            {reviews.length === 0 ? (
              <div className="rv-empty">
                {ownDashboard ? 'No reviews yet. Students can review you after a completed session.' : 'No reviews yet.'}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rv-empty">No reviews match this filter.</div>
            ) : (
              filtered.map(r => (
                <div className="rv-card" key={r._id}>
                  <div className="rv-card__top">
                    <div className="rv-card__avatar">{initials(r.student?.name)}</div>
                    <div className="rv-card__meta">
                      <h4>{r.student?.name || 'Student'}</h4>
                    </div>
                    <div className="rv-card__right">
                      <StarRating value={r.rating} readonly />
                      <span className="rv-card__date">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <p className="rv-card__comment">{r.comment}</p>

                  {r.tutorReply && (
                    <div className="rv-reply">
                      <div className="rv-reply__header">
                        <div className="rv-reply__avatar">{initials(tutor?.name)}</div>
                        <div>
                          <p className="rv-reply__name">{tutor?.name}</p>
                          <p className="rv-reply__role">Tutor's Response</p>
                        </div>
                      </div>
                      <p className="rv-reply__text">"{r.tutorReply}"</p>
                    </div>
                  )}

                  {ownDashboard && !r.tutorReply && (
                    replyingId === r._id ? (
                      <div className="rv-reply-form">
                        <textarea rows={3} maxLength={500} placeholder="Write a reply..." value={replyText} onChange={e => setReplyText(e.target.value)} />
                        <div className="tx-actions">
                          <button className="tx-btn" disabled={!replyText.trim()} onClick={() => submitReply(r._id)}>Post Reply</button>
                          <button className="tx-btn tx-btn--ghost" onClick={() => { setReplyingId(''); setReplyText('') }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button className="tx-btn tx-btn--ghost" onClick={() => { setReplyingId(r._id); setReplyText('') }}>Reply</button>
                    )
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )

  if (ownDashboard) return <TutorLayout flush>{content}</TutorLayout>
  return (
    <div>
      <Navbar />
      {content}
    </div>
  )
}
