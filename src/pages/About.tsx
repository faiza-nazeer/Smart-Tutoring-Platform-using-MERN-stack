import './About.css'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

const team = [
  { name: 'Dr. Sarah Johnson', role: 'Co-Founder & Math Tutor', emoji: '👩‍🏫' },
  { name: 'James Lee', role: 'Co-Founder & Science Tutor', emoji: '👨‍🔬' },
  { name: 'Aisha Patel', role: 'Head of Curriculum', emoji: '👩‍💻' },
  { name: 'Carlos Rivera', role: 'Student Success Lead', emoji: '🧑‍🎓' },
]

const values = [
  { icon: '🎯', title: 'Student-First', desc: 'Every decision we make is guided by what is best for learners.' },
  { icon: '🌍', title: 'Accessible Education', desc: 'Quality tutoring should be available to everyone, everywhere.' },
  { icon: '💡', title: 'Continuous Improvement', desc: 'We constantly refine our methods to deliver better outcomes.' },
  { icon: '🤝', title: 'Trust & Safety', desc: 'All our tutors are verified, background-checked, and rated.' },
]

function About() {
  return (
    <div>
      <Navbar />

      {/* ── Hero ── */}
      <section className="about-page__hero">
        <div className="about-page__hero-content">
          <span className="about-page__label">About Us</span>
          <h1 className="about-page__hero-title">Transforming Education,<br />One Session at a Time</h1>
          <p className="about-page__hero-text">
            eTutor was founded in 2020 with a simple mission: connect passionate educators with eager learners.
            Today we serve over 50,000 students across 80+ countries.
          </p>
          <Link to="/courses" className="about-page__hero-btn">Explore Tutors</Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="about-page__stats">
        {[
          { value: '50K+', label: 'Students Served' },
          { value: '1,200+', label: 'Expert Tutors' },
          { value: '80+', label: 'Countries' },
          { value: '4.9★', label: 'Average Rating' },
        ].map(s => (
          <div key={s.label} className="about-page__stat">
            <span className="about-page__stat-value">{s.value}</span>
            <span className="about-page__stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Mission ── */}
      <section className="about-page__mission">
        <div className="about-page__mission-text">
          <span className="about-page__label">Our Mission</span>
          <h2 className="about-page__section-title">Making world-class tutoring accessible to all</h2>
          <p className="about-page__section-body">
            We believe every student deserves personalized attention and guidance. Traditional education doesn't always
            accommodate individual learning styles and paces — that's the gap eTutor fills. Our platform matches students
            with tutors who not only know their subject but know how to teach it.
          </p>
          <p className="about-page__section-body">
            From K-12 to university, from test prep to professional development, eTutor has a tutor for every need,
            available on your schedule.
          </p>
        </div>
        <div className="about-page__mission-visual">
          <div className="about-page__mission-card">
            <span className="about-page__mission-icon">🚀</span>
            <p className="about-page__mission-card-text">Founded 2020</p>
          </div>
          <div className="about-page__mission-card about-page__mission-card--orange">
            <span className="about-page__mission-icon">🌟</span>
            <p className="about-page__mission-card-text">Top-rated platform</p>
          </div>
          <div className="about-page__mission-card">
            <span className="about-page__mission-icon">📚</span>
            <p className="about-page__mission-card-text">200+ subjects</p>
          </div>
          <div className="about-page__mission-card about-page__mission-card--orange">
            <span className="about-page__mission-icon">🎓</span>
            <p className="about-page__mission-card-text">Verified tutors only</p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="about-page__values">
        <span className="about-page__label" style={{ textAlign: 'center', display: 'block', marginBottom: 12 }}>Our Values</span>
        <h2 className="about-page__section-title" style={{ textAlign: 'center', marginBottom: 40 }}>What we stand for</h2>
        <div className="about-page__values-grid">
          {values.map(v => (
            <div key={v.title} className="about-page__value-card">
              <span className="about-page__value-icon">{v.icon}</span>
              <h3 className="about-page__value-title">{v.title}</h3>
              <p className="about-page__value-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section className="about-page__team">
        <span className="about-page__label" style={{ textAlign: 'center', display: 'block', marginBottom: 12 }}>Our Team</span>
        <h2 className="about-page__section-title" style={{ textAlign: 'center', marginBottom: 40 }}>Meet the people behind eTutor</h2>
        <div className="about-page__team-grid">
          {team.map(m => (
            <div key={m.name} className="about-page__team-card">
              <div className="about-page__team-avatar">{m.emoji}</div>
              <h3 className="about-page__team-name">{m.name}</h3>
              <p className="about-page__team-role">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-page__cta">
        <h2 className="about-page__cta-title">Ready to start learning?</h2>
        <p className="about-page__cta-sub">Join 50,000+ students already learning with eTutor.</p>
        <div className="about-page__cta-btns">
          <Link to="/signup" className="about-page__cta-btn about-page__cta-btn--primary">Get Started Free</Link>
          <Link to="/courses" className="about-page__cta-btn about-page__cta-btn--outline">Browse Tutors</Link>
        </div>
      </section>

      <footer className="footer">
        <p>© 2024 eTutor. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default About