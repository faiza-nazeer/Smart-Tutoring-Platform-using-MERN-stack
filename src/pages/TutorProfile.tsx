import './TutorProfile.css'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const tutor = {
  name: 'Dr. Sarah Johnson',
  title: 'Senior Mathematics Tutor',
  rating: 4.9,
  reviews: 128,
  students: 340,
  experience: '8 Years',
  hourlyRate: 45,
  subjects: ['Algebra', 'Calculus', 'Statistics', 'Geometry', 'Trigonometry'],
  bio: `I'm a passionate mathematics educator with over 8 years of experience helping students at all levels master complex concepts. My teaching approach focuses on building strong fundamentals while making math engaging and accessible. I hold a PhD in Applied Mathematics and have worked with students from middle school through university level.`,
  education: [
    { degree: 'PhD in Applied Mathematics', school: 'MIT', year: '2015' },
    { degree: 'MSc in Mathematics', school: 'Stanford University', year: '2012' },
  ],
  availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
}

const RATING_BREAKDOWN = [
  { stars: 5, count: 95,  percent: 74 },
  { stars: 4, count: 22,  percent: 17 },
  { stars: 3, count: 7,   percent: 6  },
  { stars: 2, count: 2,   percent: 2  },
  { stars: 1, count: 2,   percent: 1  },
]

type Review = {
  id: number
  student: string
  avatar: string
  rating: number
  date: string
  course: string
  comment: string
  helpful: number
  tutorReply?: string
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    student: 'Ahmed Khan',
    avatar: 'AK',
    rating: 5,
    date: '2 days ago',
    course: 'Calculus',
    comment: 'Absolutely amazing tutor! Sarah explains every concept with such clarity and patience. My grades improved from C to A in just 2 months. Highly recommend!',
    helpful: 12,
    tutorReply: 'Thank you so much Ahmed! It was a pleasure working with you. Keep up the hard work!',
  },
  {
    id: 2,
    student: 'Fatima Tariq',
    avatar: 'FT',
    rating: 5,
    date: '5 days ago',
    course: 'Algebra',
    comment: 'Best math tutor I have ever had. She breaks down complex problems into simple steps. Sessions are always well structured and engaging.',
    helpful: 8,
  },
  {
    id: 3,
    student: 'Hassan Ali',
    avatar: 'HA',
    rating: 4,
    date: '1 week ago',
    course: 'Statistics',
    comment: 'Very knowledgeable and explains concepts well. Sometimes sessions run a bit over time but that just shows how dedicated she is. Would book again.',
    helpful: 5,
  },
  {
    id: 4,
    student: 'Zara Imran',
    avatar: 'ZI',
    rating: 5,
    date: '2 weeks ago',
    course: 'Calculus',
    comment: 'I was really scared of mathematics before but Sarah made it so interesting and fun. She uses real life examples which makes everything click instantly.',
    helpful: 15,
    tutorReply: 'That means a lot Zara! Math can be fun once you see it differently. Great job this semester!',
  },
  {
    id: 5,
    student: 'Bilal Shah',
    avatar: 'BS',
    rating: 3,
    date: '3 weeks ago',
    course: 'Algebra',
    comment: 'Good tutor overall. Explains things well but sometimes moves too fast. Still recommended though.',
    helpful: 3,
  },
]

function StarRating({ value, onChange, readonly = false, size = 'md' }: {
  value: number
  onChange?: (v: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="tp-star-row">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`tp-star tp-star--${size} ${star <= (hovered || value) ? 'tp-star--filled' : ''} ${!readonly ? 'tp-star--interactive' : ''}`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
        >★</span>
      ))}
    </div>
  )
}

function TutorProfile() {
  const [reviews, setReviews]         = useState<Review[]>(INITIAL_REVIEWS)
  const [filterRating, setFilter]     = useState(0)
  const [sortBy, setSort]             = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('recent')
  const [showForm, setShowForm]       = useState(false)
  const [helpfulClicked, setHelpful]  = useState<number[]>([])
  const [newRating, setNewRating]     = useState(0)
  const [newName, setNewName]         = useState('')
  const [newCourse, setNewCourse]     = useState('Calculus')
  const [newComment, setNewComment]   = useState('')
  const [submitted, setSubmitted]     = useState(false)

  const ratingLabel = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

  const filtered = reviews
    .filter(r => filterRating === 0 || r.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === 'helpful') return b.helpful - a.helpful
      if (sortBy === 'highest') return b.rating - a.rating
      if (sortBy === 'lowest')  return a.rating - b.rating
      return b.id - a.id
    })

  const handleSubmit = () => {
    if (!newRating || !newComment.trim() || !newName.trim()) return
    const review: Review = {
      id: reviews.length + 1,
      student: newName,
      avatar: newName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      rating: newRating,
      date: 'Just now',
      course: newCourse,
      comment: newComment,
      helpful: 0,
    }
    setReviews([review, ...reviews])
    setNewRating(0); setNewName(''); setNewComment('')
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); setShowForm(false) }, 2000)
  }

  const markHelpful = (id: number) => {
    if (helpfulClicked.includes(id)) return
    setHelpful([...helpfulClicked, id])
    setReviews(prev => prev.map(r => r.id === id ? { ...r, helpful: r.helpful + 1 } : r))
  }

  return (
    <div>
      <Navbar />
      <div className="tutor-profile">

        {/* Breadcrumb */}
        <div className="tutor-profile__breadcrumb">
          <Link to="/">Home</Link> &rsaquo; <Link to="/courses">Tutors</Link> &rsaquo; <span>{tutor.name}</span>
        </div>

        <div className="tutor-profile__layout">

          {/* Left: Main Info */}
          <div className="tutor-profile__main">

            {/* Header Card */}
            <div className="tutor-profile__header-card">
              <div className="tutor-profile__avatar">
                <span>👩‍🏫</span>
              </div>
              <div className="tutor-profile__header-info">
                <h1 className="tutor-profile__name">{tutor.name}</h1>
                <p className="tutor-profile__title">{tutor.title}</p>
                <div className="tutor-profile__meta">
                  <span className="tutor-profile__rating">⭐ {tutor.rating}</span>
                  <span className="tutor-profile__reviews">({tutor.reviews} reviews)</span>
                  <span className="tutor-profile__dot">•</span>
                  <span className="tutor-profile__students">👥 {tutor.students} students</span>
                  <span className="tutor-profile__dot">•</span>
                  <span className="tutor-profile__exp">🏆 {tutor.experience}</span>
                </div>
                <div className="tutor-profile__subjects">
                  {tutor.subjects.map(s => (
                    <span key={s} className="tutor-profile__tag">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* About */}
            <div className="tutor-profile__section">
              <h2 className="tutor-profile__section-title">About Me</h2>
              <p className="tutor-profile__bio">{tutor.bio}</p>
            </div>

            {/* Education */}
            <div className="tutor-profile__section">
              <h2 className="tutor-profile__section-title">Education</h2>
              {tutor.education.map((e, i) => (
                <div key={i} className="tutor-profile__edu-item">
                  <div className="tutor-profile__edu-icon">🎓</div>
                  <div>
                    <p className="tutor-profile__edu-degree">{e.degree}</p>
                    <p className="tutor-profile__edu-school">{e.school} &middot; {e.year}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Availability */}
            <div className="tutor-profile__section">
              <h2 className="tutor-profile__section-title">Availability</h2>
              <div className="tutor-profile__days">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
                  <span
                    key={day}
                    className={`tutor-profile__day ${tutor.availability.includes(day) ? 'tutor-profile__day--active' : ''}`}
                  >{day}</span>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════
                REVIEWS SECTION
            ══════════════════════════════ */}
            <div className="tutor-profile__section tp-reviews-section">
              <div className="tp-reviews-header">
                <h2 className="tutor-profile__section-title">Ratings & Reviews</h2>
                <button className="tp-write-btn" onClick={() => setShowForm(!showForm)}>
                  {showForm ? '✕ Cancel' : '✎ Write a Review'}
                </button>
              </div>

              {/* Rating Summary */}
              <div className="tp-summary">
                <div className="tp-summary__score">
                  <span className="tp-big-rating">{tutor.rating}</span>
                  <StarRating value={Math.round(tutor.rating)} readonly size="lg" />
                  <span className="tp-total">{tutor.reviews} reviews</span>
                </div>

                <div className="tp-summary__breakdown">
                  {RATING_BREAKDOWN.map(b => (
                    <div
                      key={b.stars}
                      className={`tp-breakdown-row ${filterRating === b.stars ? 'tp-breakdown-row--active' : ''}`}
                      onClick={() => setFilter(filterRating === b.stars ? 0 : b.stars)}
                    >
                      <span className="tp-breakdown-label">{b.stars} ★</span>
                      <div className="tp-breakdown-bar">
                        <div className="tp-breakdown-fill" style={{ width: `${b.percent}%` }} />
                      </div>
                      <span className="tp-breakdown-count">{b.count}</span>
                    </div>
                  ))}
                </div>

                <div className="tp-summary__tags">
                  <h4>Students say</h4>
                  <div className="tp-tags">
                    <span className="tp-tag">😊 Very Patient</span>
                    <span className="tp-tag">📖 Clear</span>
                    <span className="tp-tag">⏰ Punctual</span>
                    <span className="tp-tag">📝 Detailed</span>
                    <span className="tp-tag">💡 Great Examples</span>
                  </div>
                </div>
              </div>

              {/* Write Review Form */}
              {showForm && (
                <div className="tp-form">
                  <h3>Write Your Review</h3>
                  {submitted ? (
                    <div className="tp-success">✅ Review submitted! Thank you.</div>
                  ) : (
                    <>
                      <div className="tp-form__row">
                        <div className="tp-form__group">
                          <label>Your Name</label>
                          <input
                            type="text"
                            placeholder="Enter your name"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                          />
                        </div>
                        <div className="tp-form__group">
                          <label>Subject</label>
                          <select value={newCourse} onChange={e => setNewCourse(e.target.value)}>
                            {tutor.subjects.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="tp-form__group">
                        <label>Your Rating</label>
                        <div className="tp-form__rating">
                          <StarRating value={newRating} onChange={setNewRating} size="lg" />
                          {newRating > 0 && (
                            <span className="tp-rating-label">{ratingLabel[newRating]}</span>
                          )}
                        </div>
                      </div>

                      <div className="tp-form__group">
                        <label>Your Review</label>
                        <textarea
                          placeholder="Share your experience with this tutor..."
                          value={newComment}
                          onChange={e => setNewComment(e.target.value)}
                          rows={4}
                        />
                        <span className="tp-char-count">{newComment.length} / 500</span>
                      </div>

                      <button
                        className="tp-submit-btn"
                        onClick={handleSubmit}
                        disabled={!newRating || !newComment.trim() || !newName.trim()}
                      >
                        Submit Review
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Sort & Filter */}
              <div className="tp-controls">
                <div className="tp-chips">
                  <button className={`tp-chip ${filterRating === 0 ? 'tp-chip--active' : ''}`} onClick={() => setFilter(0)}>
                    All ({reviews.length})
                  </button>
                  {[5, 4, 3, 2, 1].map(r => (
                    <button
                      key={r}
                      className={`tp-chip ${filterRating === r ? 'tp-chip--active' : ''}`}
                      onClick={() => setFilter(filterRating === r ? 0 : r)}
                    >
                      {r} ★ ({reviews.filter(rv => rv.rating === r).length})
                    </button>
                  ))}
                </div>
                <select className="tp-sort" value={sortBy} onChange={e => setSort(e.target.value as typeof sortBy)}>
                  <option value="recent">Most Recent</option>
                  <option value="helpful">Most Helpful</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>

              <p className="tp-showing">
                Showing {filtered.length} of {reviews.length} reviews
                {filterRating > 0 && ` · ${filterRating} stars`}
              </p>

              {/* Review Cards */}
              <div className="tp-review-list">
                {filtered.length === 0 ? (
                  <div className="tp-empty">No reviews for this filter.</div>
                ) : filtered.map(r => (
                  <div className="tp-review-card" key={r.id}>
                    <div className="tp-review-card__top">
                      <div className="tp-review-card__avatar">{r.avatar}</div>
                      <div className="tp-review-card__meta">
                        <h4>{r.student}</h4>
                        <p className="tp-review-card__course">{r.course}</p>
                      </div>
                      <div className="tp-review-card__right">
                        <StarRating value={r.rating} readonly size="sm" />
                        <span className="tp-review-card__date">{r.date}</span>
                      </div>
                    </div>

                    <p className="tp-review-card__comment">{r.comment}</p>

                    {/* Tutor Reply */}
                    {r.tutorReply && (
                      <div className="tp-reply">
                        <div className="tp-reply__header">
                          <div className="tp-reply__avatar">SJ</div>
                          <div>
                            <p className="tp-reply__name">Dr. Sarah Johnson</p>
                            <p className="tp-reply__role">Tutor's Response</p>
                          </div>
                        </div>
                        <p className="tp-reply__text">"{r.tutorReply}"</p>
                      </div>
                    )}

                    <div className="tp-review-card__footer">
                      <button
                        className={`tp-helpful-btn ${helpfulClicked.includes(r.id) ? 'tp-helpful-btn--clicked' : ''}`}
                        onClick={() => markHelpful(r.id)}
                      >
                        👍 Helpful ({r.helpful})
                      </button>
                      <span className="tp-stars-badge">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* END REVIEWS */}

          </div>

          {/* Right: Booking Card */}
          <div className="tutor-profile__sidebar">
            <div className="tutor-profile__booking-card">
              <div className="tutor-profile__rate">
                <span className="tutor-profile__rate-value">${tutor.hourlyRate}</span>
                <span className="tutor-profile__rate-label">/ hour</span>
              </div>
              <Link to="/booking" className="tutor-profile__book-btn">Book a Session</Link>
              <Link to="/contact" className="tutor-profile__msg-btn">Send Message</Link>
              <div className="tutor-profile__card-stats">
                <div className="tutor-profile__card-stat">
                  <span className="tutor-profile__card-stat-value">{tutor.rating}</span>
                  <span className="tutor-profile__card-stat-label">Rating</span>
                </div>
                <div className="tutor-profile__card-stat">
                  <span className="tutor-profile__card-stat-value">{tutor.students}</span>
                  <span className="tutor-profile__card-stat-label">Students</span>
                </div>
                <div className="tutor-profile__card-stat">
                  <span className="tutor-profile__card-stat-value">{tutor.experience}</span>
                  <span className="tutor-profile__card-stat-label">Experience</span>
                </div>
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

export default TutorProfile