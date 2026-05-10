import { useEffect, useState } from 'react'

function Stats() {
  const [tutorCount, setTutorCount] = useState(0)
  const [studentCount, setStudentCount] = useState(0)
  const [avgRating, setAvgRating] = useState(0)

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then((data: any[]) => {
        const tutors = data.filter(u => u.role === 'tutor')
        const students = data.filter(u => u.role === 'student')
        setTutorCount(tutors.length)
        setStudentCount(students.length)

        // Calculate average rating from tutors
        const tutorsWithRating = tutors.filter(t => t.rating > 0)
        if (tutorsWithRating.length > 0) {
          const avg = tutorsWithRating.reduce((sum, t) => sum + t.rating, 0) / tutorsWithRating.length
          setAvgRating(Math.round(avg * 10) / 10)
        }
      })
      .catch(err => console.error(err))
  }, [])

  const stats = [
    { value: `${tutorCount}+`, label: 'Verified Tutors' },
    { value: `${studentCount}+`, label: 'Students Enrolled' },
    { value: `${avgRating}★`, label: 'Average Rating' },
  ]

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