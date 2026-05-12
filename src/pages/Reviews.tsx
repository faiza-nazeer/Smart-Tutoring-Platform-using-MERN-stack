import { useState, useEffect } from 'react';
import './Reviews.css';
import { useAuth } from '../context/AuthContext';

type Review = {
  _id: string;
  student: any;
  tutor: any;
  rating: number;
  comment: string;
  helpful: number;
  tutorReply?: string;
  createdAt: string;
};

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
        >★</span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilter] = useState(0);
  const [sortBy, setSort] = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('recent');
  const [showForm, setShowForm] = useState(false);
  const [helpfulClicked, setHelpful] = useState<string[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [tutors, setTutors] = useState<any[]>([]);
  const [selectedTutor, setSelectedTutor] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/reviews').then(r => r.json()),
      fetch('http://localhost:5000/api/users').then(r => r.json()),
    ]).then(([reviewsData, usersData]) => {
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setTutors(usersData.filter((u: any) => u.role === 'tutor'));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const RATING_BREAKDOWN = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percent: reviews.length
      ? Math.round((reviews.filter(r => r.rating === stars).length / reviews.length) * 100)
      : 0,
  }));

  const filtered = reviews
    .filter(r => filterRating === 0 || r.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === 'helpful') return b.helpful - a.helpful;
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleSubmitReview = async () => {
    if (!newRating || !newComment.trim() || !selectedTutor || !user) return;
    try {
      const res = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: user._id,
          tutor: selectedTutor,
          rating: newRating,
          comment: newComment,
        }),
      });
      const saved = await res.json();
      const populated = await fetch(`http://localhost:5000/api/reviews`).then(r => r.json());
      setReviews(populated);
      setNewRating(0);
      setNewComment('');
      setSelectedTutor('');
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setShowForm(false); }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const markHelpful = async (id: string) => {
    if (helpfulClicked.includes(id)) return;
    setHelpful([...helpfulClicked, id]);
    setReviews(prev => prev.map(r =>
      r._id === id ? { ...r, helpful: r.helpful + 1 } : r
    ));
  };

  const ratingLabel = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  if (loading) return <div style={{ padding: '2rem' }}>Loading reviews...</div>;

  return (
    <div className="rv-page">

      <div className="rv-header">
        <div>
          <h1>Ratings & Reviews</h1>
          <p>What students say about our tutors</p>
        </div>
        {user && (
          <button className="rv-write-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '✎ Write a Review'}
          </button>
        )}
      </div>

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

      {showForm && (
        <div className="rv-form">
          <h2>Write Your Review</h2>
          {submitted ? (
            <div className="rv-success">✅ Review submitted successfully!</div>
          ) : (
            <>
              <div className="rv-form__group">
                <label>Select Tutor</label>
                <select
                  value={selectedTutor}
                  onChange={e => setSelectedTutor(e.target.value)}
                >
                  <option value="">Choose a tutor...</option>
                  {tutors.map(t => (
                    <option key={t._id} value={t._id}>{t.name} — {t.subject}</option>
                  ))}
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
                  placeholder="Share your experience..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  rows={4}
                />
                <span className="rv-char-count">{newComment.length} / 500</span>
              </div>

              <button
                className="rv-submit-btn"
                onClick={handleSubmitReview}
                disabled={!newRating || !newComment.trim() || !selectedTutor}
              >
                Submit Review
              </button>
            </>
          )}
        </div>
      )}

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

      <div className="rv-list">
        {filtered.length === 0 ? (
          <div className="rv-empty">
            {reviews.length === 0
              ? 'No reviews yet. Be the first to review!'
              : 'No reviews found for this filter.'}
          </div>
        ) : (
          filtered.map(r => (
            <div className="rv-card" key={r._id}>
              <div className="rv-card__top">
                <div className="rv-card__avatar">
                  {r.student?.name?.slice(0, 2).toUpperCase()}
                </div>
                <div className="rv-card__meta">
                  <h4>{r.student?.name}</h4>
                  <p className="rv-card__course">
                    Review for: {r.tutor?.name}
                  </p>
                </div>
                <div className="rv-card__right">
                  <StarRating value={r.rating} readonly />
                  <span className="rv-card__date">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p className="rv-card__comment">{r.comment}</p>

              {r.tutorReply && (
                <div className="rv-reply">
                  <div className="rv-reply__header">
                    <div className="rv-reply__avatar">
                      {r.tutor?.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="rv-reply__name">{r.tutor?.name}</p>
                      <p className="rv-reply__role">Tutor's Response</p>
                    </div>
                  </div>
                  <p className="rv-reply__text">"{r.tutorReply}"</p>
                </div>
              )}

              <div className="rv-card__footer">
                <button
                  className={`rv-helpful-btn ${helpfulClicked.includes(r._id) ? 'rv-helpful-btn--clicked' : ''}`}
                  onClick={() => markHelpful(r._id)}
                >
                  👍 Helpful ({r.helpful})
                </button>
                <span className="rv-card__rating-badge">
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}