// Hero.tsx
// No CSS import here — styles come from Home.css (imported in Home.tsx)

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__content">
        <div className="hero__badge">
          <span className="hero__badge-new">New</span>
          <span className="hero__badge-text">Get 30% off in any course in April 2025</span>
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
      </div>

      <div className="hero__image-wrap">
        <div className="hero__circle hero__circle--top-right"></div>
        <div className="hero__circle hero__circle--bottom-right"></div>
        <div className="hero__floating-icon hero__floating-icon--tl">🎯</div>
        <div className="hero__floating-icon hero__floating-icon--tr">🎓</div>
        <div className="hero__floating-icon hero__floating-icon--br">📚</div>

        <div className="hero__card">
          <div className="hero__card-icon">🎓</div>
          <p className="hero__card-title">Learn from verified tutors</p>
          <ul className="hero__card-list">
            <li>1-on-1 online sessions</li>
            <li>Flexible scheduling</li>
            <li>20+ subjects</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Hero