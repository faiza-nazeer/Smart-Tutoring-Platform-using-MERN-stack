import './Courses.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getCourses } from '../api/api'

interface Course {
  _id: string
  title: string
  tutor: { _id: string; name: string; email: string }
  subject: string
  rating: number
  studentsEnrolled: number
  price: number
  level: string
}

const SUBJECTS = ['All', 'Mathematics', 'Physics', 'English', 'Chemistry', 'Biology', 'Computer Science', 'Urdu', 'Statistics']

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="star-rating">
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span className="star-rating__num">{rating}</span>
    </span>
  )
}

function Courses() {
  const [search, setSearch] = useState('')
  const [activeSubject, setActiveSubject] = useState('All')
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCourses()
      .then((data: any[]) => {
        setCourses(data)
        setLoading(false)
      })
      .catch((err: any) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.tutor?.name.toLowerCase().includes(search.toLowerCase())
    const matchSubject = activeSubject === 'All' || c.subject === activeSubject
    return matchSearch && matchSubject
  })

  if (loading) return <div style={{ padding: '2rem' }}>Loading courses...</div>

  return (
    <div className="courses-page">
      <Navbar />

      <div className="courses-header">
        <div className="courses-header__inner">
          <h1 className="courses-header__heading">Find Your Perfect Tutor</h1>
          <p className="courses-header__subtext">
            Browse {courses.length}+ courses across subjects taught by verified tutors
          </p>

          <div className="courses-search">
            <span className="courses-search__icon">🔍</span>
            <input
              type="text"
              className="courses-search__input"
              placeholder="Search by course name or tutor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="courses-search__clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>
      </div>

      <div className="courses-body">
        <div className="courses-filters">
          {SUBJECTS.map(s => (
            <button
              key={s}
              className={`courses-filter-btn ${activeSubject === s ? 'courses-filter-btn--active' : ''}`}
              onClick={() => setActiveSubject(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <p className="courses-results-count">
          {filtered.length} {filtered.length === 1 ? 'course' : 'courses'} found
          {activeSubject !== 'All' && ` in ${activeSubject}`}
        </p>

        {filtered.length > 0 ? (
          <div className="courses-grid">
            {filtered.map(course => (
              <Link to={`/courses/${course._id}`} className="course-card" key={course._id}>
                <div className="course-card__banner">
                  <span className="course-card__subject">{course.subject}</span>
                  <span className="course-card__level">{course.level}</span>
                </div>

                <h3 className="course-card__title">{course.title}</h3>

                <div className="course-card__tutor">
                  <div className="course-card__avatar">
                    {course.tutor?.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="course-card__tutor-name">{course.tutor?.name}</span>
                </div>

                <div className="course-card__rating">
                  <StarRating rating={course.rating || 0} />
                  <span className="course-card__reviews">({course.studentsEnrolled || 0} students)</span>
                </div>

                <div className="course-card__footer">
                  <span className="course-card__price">Rs {course.price}<span>/hr</span></span>
                  <button className="course-card__btn">View Details</button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="courses-empty">
            <span className="courses-empty__icon">🔎</span>
            <p className="courses-empty__text">No courses found</p>
            <button className="btn-primary" onClick={() => { setSearch(''); setActiveSubject('All') }}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Courses