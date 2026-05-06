// Courses.tsx
// Browse all courses/tutors with search and subject filter
import './Courses.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

interface Course {
  id: number
  title: string
  tutor: string
  subject: string
  rating: number
  reviews: number
  price: number
  level: string
  avatar: string
}

const ALL_COURSES: Course[] = [
  { id: 1, title: 'Master Mathematics from Basics to Advanced', tutor: 'Ayesha Khan', subject: 'Mathematics', rating: 4.9, reviews: 128, price: 800, level: 'All Levels', avatar: 'AK' },
  { id: 2, title: 'Physics for Matric & Intermediate Students', tutor: 'Zain Ahmed', subject: 'Physics', rating: 4.8, reviews: 95, price: 750, level: 'Intermediate', avatar: 'ZA' },
  { id: 3, title: 'English Grammar & Writing Masterclass', tutor: 'Sara Raza', subject: 'English', rating: 4.7, reviews: 210, price: 600, level: 'Beginner', avatar: 'SR' },
  { id: 4, title: 'Chemistry: Concepts Made Simple', tutor: 'Hamid Ali', subject: 'Chemistry', rating: 4.6, reviews: 87, price: 700, level: 'Intermediate', avatar: 'HA' },
  { id: 5, title: 'Biology for Pre-Medical Preparation', tutor: 'Nadia Iqbal', subject: 'Biology', rating: 4.9, reviews: 154, price: 850, level: 'Advanced', avatar: 'NI' },
  { id: 6, title: 'Computer Science & Programming Fundamentals', tutor: 'Usman Tariq', subject: 'Computer Science', rating: 4.8, reviews: 76, price: 900, level: 'Beginner', avatar: 'UT' },
  { id: 7, title: 'Urdu Literature & Comprehension', tutor: 'Farah Naz', subject: 'Urdu', rating: 4.5, reviews: 63, price: 500, level: 'All Levels', avatar: 'FN' },
  { id: 8, title: 'Statistics & Probability Crash Course', tutor: 'Omar Sheikh', subject: 'Statistics', rating: 4.7, reviews: 112, price: 780, level: 'Advanced', avatar: 'OS' },
]

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

  const filtered = ALL_COURSES.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.tutor.toLowerCase().includes(search.toLowerCase())
    const matchSubject = activeSubject === 'All' || c.subject === activeSubject
    return matchSearch && matchSubject
  })

  return (
    <div className="courses-page">
      <Navbar />

      {/* Page header */}
      <div className="courses-header">
        <div className="courses-header__inner">
          <h1 className="courses-header__heading">Find Your Perfect Tutor</h1>
          <p className="courses-header__subtext">
            Browse {ALL_COURSES.length}+ courses across 8 subjects taught by verified tutors
          </p>

          {/* Search bar */}
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

        {/* Subject filter pills */}
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

        {/* Results count */}
        <p className="courses-results-count">
          {filtered.length} {filtered.length === 1 ? 'course' : 'courses'} found
          {activeSubject !== 'All' && ` in ${activeSubject}`}
        </p>

        {/* Course grid */}
        {filtered.length > 0 ? (
          <div className="courses-grid">
            {filtered.map(course => (
              <Link to={`/courses/${course.id}`} className="course-card" key={course.id}>
                {/* Card top banner */}
                <div className="course-card__banner">
                  <span className="course-card__subject">{course.subject}</span>
                  <span className="course-card__level">{course.level}</span>
                </div>

                {/* Title */}
                <h3 className="course-card__title">{course.title}</h3>

                {/* Tutor row */}
                <div className="course-card__tutor">
                  <div className="course-card__avatar">{course.avatar}</div>
                  <span className="course-card__tutor-name">{course.tutor}</span>
                </div>

                {/* Rating */}
                <div className="course-card__rating">
                  <StarRating rating={course.rating} />
                  <span className="course-card__reviews">({course.reviews} reviews)</span>
                </div>

                {/* Footer */}
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
            <p className="courses-empty__text">No courses found for "{search}"</p>
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