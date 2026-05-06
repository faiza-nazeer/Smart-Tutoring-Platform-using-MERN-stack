// Stats.tsx
// No CSS import here — styles come from Home.css (imported in Home.tsx)

interface Stat {
  value: string
  label: string
}

const stats: Stat[] = [
  { value: '500+', label: 'Verified Tutors' },
  { value: '10K+', label: 'Students Enrolled' },
  { value: '4.8★', label: 'Average Rating' },
]

function Stats() {
  return (
    <section className="stats">
      <div className="stats__left">
        <h2 className="stats__heading">
          A platform built for
          both learners and
          educators
        </h2>
        <p className="stats__subtext">
          Join a growing community of students finding
          their perfect tutor, and tutors building
          their teaching career.
        </p>
      </div>

      <div className="stats__right">
        {stats.map((stat) => (
          <div className="stats__item" key={stat.label}>
            <span className="stats__value">{stat.value}</span>
            <span className="stats__label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Stats