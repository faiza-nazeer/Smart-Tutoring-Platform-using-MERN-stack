import { useState } from 'react';
import './Reviews.css';

type Review = {
  id: number;
  student: string;
  avatar: string;
  rating: number;
  date: string;
  course: string;
  comment: string;
  helpful: number;
  tutorReply?: string;
};

const REVIEWS: Review[] = [
  {
    id: 1,
    student: 'Ahmed Khan',
    avatar: 'AK',
    rating: 5,
    date: '2 days ago',
    course: 'Master Mathematics',
    comment: 'Absolutely amazing tutor! Ayesha explains every concept with such clarity and patience. My grades improved from C to A in just 2 months. Highly recommend to anyone struggling with math.',
    helpful: 12,
    tutorReply: 'Thank you so much Ahmed! It was a pleasure working with you. Keep up the hard work!',
  },
  {
    id: 2,
    student: 'Fatima Tariq',
    avatar: 'FT',
    rating: 5,
    date: '5 days ago',
    course: 'Advanced Algebra',
    comment: 'Best math tutor I have ever had. She breaks down complex problems into simple steps. Sessions are always well structured and engaging.',
    helpful: 8,
  },
  {
    id: 3,
    student: 'Hassan Ali',
    avatar: 'HA',
    rating: 4,
    date: '1 week ago',
    course: 'Calculus Fundamentals',
    comment: 'Very knowledgeable and explains concepts well. Sometimes sessions run a bit over time but that shows how dedicated she is. Would definitely book again.',
    helpful: 5,
  },
  {
    id: 4,
    student: 'Zara Imran',
    avatar: 'ZI',
    rating: 5,
    date: '2 weeks ago',
    course: 'Master Mathematics',
    comment: 'I was really scared of mathematics before but Ayesha made it so interesting and fun. She uses real life examples which makes everything click instantly.',
    helpful: 15,
    tutorReply: 'That means a lot Zara! Math can be fun once you see it differently. Great job this semester!',
  },
  {
    id: 5,
    student: 'Bilal Shah',
    avatar: 'BS',
    rating: 3,
    date: '3 weeks ago',
    course: 'Advanced Algebra',
    comment: 'Good tutor overall. Explains things well but sometimes moves too fast. Had to ask her to repeat explanations a few times. Still recommended.',
    helpful: 3,
  },
  {
    id: 6,
    student: 'Nadia Iqbal',
    avatar: 'NI',
    rating: 5,
    date: '1 month ago',
    course: 'Calculus Fundamentals',
    comment: 'Exceptional teaching! Ayesha is patient, thorough, and always prepares customized notes for each session. Worth every rupee.',
    helpful: 20,
  },
];

const RATING_BREAKDOWN = [
  { stars: 5, count: 89, percent: 74 },
  { stars: 4, count: 20, percent: 17 },
  { stars: 3, count: 7,  percent: 6  },
  { stars: 2, count: 2,  percent: 2  },
  { stars: 1, count: 2,  percent: 1  },
];

function StarRating({ value, onChange, readonly = false }: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  const [hovered, setHovered] = useState(0);

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
  );
}

export default function Reviews() {
  const [reviews, setReviews]       = useState<Review[]>(REVIEWS);
  const [filterRating, setFilter]   = useState(0);
  const [sortBy, setSort]           = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('recent');
  const [showForm, setShowForm]     = useState(false);
  const [helpfulClicked, setHelpful] = useState<number[]>([]);

  // New review form state
  const [newRating, setNewRating]   = useState(0);
  const [newCourse, setNewCourse]   = useState('Master Mathematics');
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName]       = useState('');
  const [submitted, setSubmitted]   = useState(false);

  const avgRating = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);

  const filtered = reviews
    .filter(r => filterRating === 0 || r.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === 'helpful') return b.helpful - a.helpful;
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest')  return a.rating - b.rating;
      return b.id - a.id;
    });

  const handleSubmitReview = () => {
    if (!newRating || !newComment.trim() || !newName.trim()) return;
    const review: Review = {
      id: reviews.length + 1,
      student: newName,
      avatar: newName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      rating: newRating,
      date: 'Just now',
      course: newCourse,
      comment: newComment,
      helpful: 0,
    };
    setReviews([review, ...reviews]);
    setNewRating(0);
    setNewComment('');
    setNewName('');
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowForm(false); }, 2000);
  };

  const markHelpful = (id: number) => {
    if (helpfulClicked.includes(id)) return;
    setHelpful([...helpfulClicked, id]);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, helpful: r.helpful + 1 } : r));
  };

  const ratingLabel = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="rv-page">

      {/* Header */}
      <div className="rv-header">
        <div>
          <h1>Ratings & Reviews</h1>
          <p>Ayesha Khan · Mathematics Tutor</p>
        </div>
        <button className="rv-write-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '✎ Write a Review'}
        </button>
      </div>

      {/* Summary */}
      <div className="rv-summary">
        <div className="rv-summary__score">
          <span className="rv-big-rating">{avgRating}</span>
          <StarRating value={Math.round(Number(avgRating))} readonly />
          <span className="rv-total">{reviews.length} reviews</span>
        </div>

        <div className="rv-summary__breakdown">
          {RATING_BREAKDOWN.map(b => (
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

        <div className="rv-summary__highlights">
          <h3>What students say</h3>
          <div className="rv-tags">
            <span className="rv-tag">😊 Very Patient</span>
            <span className="rv-tag">📖 Clear Explanations</span>
            <span className="rv-tag">⏰ Punctual</span>
            <span className="rv-tag">📝 Detailed Notes</span>
            <span className="rv-tag">💡 Great Examples</span>
          </div>
        </div>
      </div>

      {/* Write Review Form */}
      {showForm && (
        <div className="rv-form">
          <h2>Write Your Review</h2>

          {submitted ? (
            <div className="rv-success">✅ Review submitted successfully! Thank you.</div>
          ) : (
            <>
              <div className="rv-form__group">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                />
              </div>

              <div className="rv-form__group">
                <label>Course</label>
                <select value={newCourse} onChange={e => setNewCourse(e.target.value)}>
                  <option>Master Mathematics</option>
                  <option>Advanced Algebra</option>
                  <option>Calculus Fundamentals</option>
                </select>
              </div>

              <div className="rv-form__group">
                <label>Your Rating</label>
                <div className="rv-form__rating">
                  <StarRating value={newRating} onChange={setNewRating} />
                  {newRating > 0 && (
                    <span className="rv-rating-label">{ratingLabel[newRating]}</span>
                  )}
                </div>
              </div>

              <div className="rv-form__group">
                <label>Your Review</label>
                <textarea
                  placeholder="Share your experience with this tutor..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  rows={4}
                />
                <span className="rv-char-count">{newComment.length} / 500</span>
              </div>

              <button
                className="rv-submit-btn"
                onClick={handleSubmitReview}
                disabled={!newRating || !newComment.trim() || !newName.trim()}
              >
                Submit Review
              </button>
            </>
          )}
        </div>
      )}

      {/* Filters & Sort */}
      <div className="rv-controls">
        <div className="rv-filter-chips">
          <button
            className={`rv-chip ${filterRating === 0 ? 'rv-chip--active' : ''}`}
            onClick={() => setFilter(0)}
          >
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

        <select
          className="rv-sort"
          value={sortBy}
          onChange={e => setSort(e.target.value as typeof sortBy)}
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      <p className="rv-showing">
        Showing {filtered.length} of {reviews.length} reviews
        {filterRating > 0 && ` · filtered by ${filterRating} stars`}
      </p>

      {/* Reviews List */}
      <div className="rv-list">
        {filtered.length === 0 ? (
          <div className="rv-empty">No reviews found for this filter.</div>
        ) : (
          filtered.map(r => (
            <div className="rv-card" key={r.id}>
              <div className="rv-card__top">
                <div className="rv-card__avatar">{r.avatar}</div>
                <div className="rv-card__meta">
                  <h4>{r.student}</h4>
                  <p className="rv-card__course">{r.course}</p>
                </div>
                <div className="rv-card__right">
                  <StarRating value={r.rating} readonly />
                  <span className="rv-card__date">{r.date}</span>
                </div>
              </div>

              <p className="rv-card__comment">{r.comment}</p>

              {/* Tutor Reply */}
              {r.tutorReply && (
                <div className="rv-reply">
                  <div className="rv-reply__header">
                    <div className="rv-reply__avatar">AK</div>
                    <div>
                      <p className="rv-reply__name">Ayesha Khan</p>
                      <p className="rv-reply__role">Tutor's Response</p>
                    </div>
                  </div>
                  <p className="rv-reply__text">"{r.tutorReply}"</p>
                </div>
              )}

              <div className="rv-card__footer">
                <button
                  className={`rv-helpful-btn ${helpfulClicked.includes(r.id) ? 'rv-helpful-btn--clicked' : ''}`}
                  onClick={() => markHelpful(r.id)}
                >
                  👍 Helpful ({r.helpful})
                </button>
                <span className="rv-card__rating-badge">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}