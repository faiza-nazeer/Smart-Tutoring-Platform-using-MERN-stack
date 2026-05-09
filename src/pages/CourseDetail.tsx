import './CourseDetail.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getCourse } from '../api/api'

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="cd-stars">
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    </span>
  )
}

function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getCourse(id)
      .then((data: any) => {
        if (data.message) {
          setCourse(null)
        } else {
          setCourse(data)
        }
        setLoading(false)
      })
      .catch((err: any) => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div style={{ padding: '2rem' }}>Loading course...</div>

  if (!course) {
    return (
      <div className="cd-page">
        <Navbar />
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Course not found</h2>
          <button onClick={() => navigate('/courses')} style={{ marginTop: '1rem' }}>
            Back to Courses
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cd-page">
      <Navbar />

      <div className="cd-banner">
        <div className="cd-banner__inner">
          <span className="cd-banner__subject">{course.subject}</span>
          <h1 className="cd-banner__title">{course.title}</h1>
          <div className="cd-banner__meta">
            <span className="cd-banner__rating">
              <StarRating rating={course.rating || 0} />
              <strong>{course.rating || 0}</strong> ({course.studentsEnrolled || 0} students)
            </span>
            <span className="cd-banner__dot">·</span>
            <span>{course.level}</span>
          </div>
        </div>
      </div>

      <div className="cd-body">
        <div className="cd-main">

          <section className="cd-section">
            <h2 className="cd-section__heading">About this course</h2>
            <p style={{ color: 'var(--gray)', lineHeight: 1.8 }}>
              {course.description || 'No description provided yet.'}
            </p>
          </section>

          <section className="cd-section">
            <h2 className="cd-section__heading">About the tutor</h2>
            <div className="cd-tutor-about">
              <div className="cd-tutor-about__avatar">
                {course.tutor?.name?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="cd-tutor-about__name">{course.tutor?.name}</p>
                <p className="cd-tutor-about__exp">{course.tutor?.email}</p>
              </div>
            </div>
          </section>

        </div>

        <aside className="cd-sidebar">
          <div className="cd-booking-card">
            <p className="cd-booking-card__price">
              Rs {course.price}<span>/hour</span>
            </p>

            <div className="cd-booking-card__info">
              <div className="cd-booking-card__info-row">
                <span>⭐ Rating</span>
                <strong>{course.rating || 0} / 5</strong>
              </div>
              <div className="cd-booking-card__info-row">
                <span>👥 Students</span>
                <strong>{course.studentsEnrolled || 0}</strong>
              </div>
              <div className="cd-booking-card__info-row">
                <span>🎓 Level</span>
                <strong>{course.level}</strong>
              </div>
            </div>

            <a href="/booking" className="cd-booking-card__btn">
              Book a Session
            </a>
            <button className="cd-booking-card__msg-btn">
              Message Tutor
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CourseDetail