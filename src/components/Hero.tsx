import { useEffect, useState } from 'react'

function Hero() {
  const [courseCount, setCourseCount] = useState(0)

  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then(data => setCourseCount(data.length))
      .catch(() => {})
  }, [])

  return (
    <section className="hero" id="home">
      <div className="hero__content">
        <div className="hero__badge">
          <span className="hero__badge-new">New</span>
          <span className="hero__badge-text">
            Browse {courseCount}+ courses from verified tutors
          </span>
        </div>

        <h1 className="hero__heading">
          Learn, Teach &<br />
          Grow Together<br />
          Online
        </h1>

        <p className="hero__subtext">
          Whether you're looking to learn a new skill or share
          your expertise — ETutor connects students and tutors
          for a smarter learning experience.
        </p>

        <div className="hero__ctas">
          <a href="/dashboard/find-tutors" className="hero__cta-btn hero__cta-btn--primary">
            Find a Tutor
          </a>
          <a href="/signup?role=tutor" className="hero__cta-btn hero__cta-btn--outline">
            Become a Tutor
          </a>
        </div>

        <div className="hero__search">
          <div className="hero__search-input-wrap">
            <span className="hero__search-icon">🔍</span>
            <input
              type="text"
              className="hero__search-input"
              placeholder="Search for a course or subject..."
            />
          </div>
          <button
            className="hero__search-btn"
            onClick={() => window.location.href = '/courses'}
          >
            Search
          </button>
        </div>
      </div>

      <div className="hero__image-wrap">
        <div className="hero__circle hero__circle--top-right"></div>
        <div className="hero__circle hero__circle--bottom-right"></div>
        <div className="hero__floating-icon hero__floating-icon--tl">🎯</div>
        <div className="hero__floating-icon hero__floating-icon--tr">🎓</div>
        <div className="hero__floating-icon hero__floating-icon--br">📚</div>
        <div className="hero__image-placeholder">
          <span>📸 Add hero image here</span>
          <code>src/assets/tutor-hero.png</code>
        </div>
      </div>
    </section>
  )
}

export default Hero