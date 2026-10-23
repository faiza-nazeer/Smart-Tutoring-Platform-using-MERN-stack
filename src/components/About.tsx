// About.tsx
// No CSS import here — styles come from Home.css (imported in Home.tsx)

function About() {
  return (
    <section className="about" id="about">
      <div className="about__image-wrap">
        <div className="about__circle-bg"></div>

        <div className="about__card">
          <div className="about__card-item"><span>✅</span> Verified, expert tutors</div>
          <div className="about__card-item"><span>📅</span> Easy session booking</div>
          <div className="about__card-item"><span>💼</span> Tools for tutors to grow</div>
        </div>
      </div>

      <div className="about__content">
        <span className="about__label">Why choose ETutor</span>
        <h2 className="about__heading">
          A smarter way to
          learn and teach
          from anywhere.
        </h2>
        <p className="about__text">
          ETutor brings students and tutors together on one easy platform.
          Students get access to verified, expert tutors across 20+ subjects.
          Tutors get tools to manage sessions, grow their student base, and
          earn on a flexible schedule. Everyone wins.
        </p>
        
      </div>
    </section>
  )
}

export default About