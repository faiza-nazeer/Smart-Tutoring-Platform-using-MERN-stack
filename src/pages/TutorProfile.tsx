import './TutorProfile.css'
import Navbar from '../components/Navbar'
import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

function TutorProfile() {
  const { id } = useParams()
  const [tutor, setTutor] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!id) return
    Promise.all([
      fetch(`http://localhost:5000/api/users/${id}`).then(r => r.json()),
      fetch(`http://localhost:5000/api/courses`).then(r => r.json()),
    ]).then(([tutorData, coursesData]) => {
      setTutor(tutorData)
      const tutorCourses = coursesData.filter((c: any) => c.tutor?._id === id)
      setCourses(tutorCourses)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ padding: '2rem' }}>Loading tutor profile...</div>

  if (!tutor || tutor.message) return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Tutor not found</h2>
        <Link to="/dashboard/find-tutors">← Back to Tutors</Link>
      </div>
    </div>
  )

  return (
    <div>
      <Navbar />
      <div className="tutor-profile">

        <div className="tutor-profile__breadcrumb">
          <Link to="/">Home</Link> &rsaquo;{' '}
          <Link to="/dashboard/find-tutors">Tutors</Link> &rsaquo;{' '}
          <span>{tutor.name}</span>
        </div>

        <div className="tutor-profile__layout">

          <div className="tutor-profile__main">

            {/* Header Card */}
            <div className="tutor-profile__header-card">
              <div className="tutor-profile__avatar">
                <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--purple)' }}>
                  {tutor.name?.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="tutor-profile__header-info">
                <h1 className="tutor-profile__name">{tutor.name}</h1>
                <p className="tutor-profile__title">{tutor.subject} Tutor</p>
                <div className="tutor-profile__meta">
                  <span className="tutor-profile__rating">⭐ {tutor.rating || 0}</span>
                  <span className="tutor-profile__dot">•</span>
                  <span>👥 {tutor.sessions || 0} sessions</span>
                  <span className="tutor-profile__dot">•</span>
                  <span>📍 {tutor.city || 'N/A'}</span>
                </div>
                <div className="tutor-profile__subjects">
                  <span className="tutor-profile__tag">{tutor.subject}</span>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="tutor-profile__section">
              <h2 className="tutor-profile__section-title">About Me</h2>
              <p className="tutor-profile__bio">
                {tutor.bio || `Hi! I'm ${tutor.name}, a passionate ${tutor.subject} tutor based in ${tutor.city || 'Pakistan'}. I have completed ${tutor.sessions || 0} sessions and maintain a rating of ${tutor.rating || 0}/5. I'm dedicated to helping students achieve their academic goals.`}
              </p>
            </div>

            {/* Stats */}
            <div className="tutor-profile__section">
              <h2 className="tutor-profile__section-title">Stats</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem'
              }}>
                {[
                  { label: 'Sessions', value: tutor.sessions || 0, icon: '✅' },
                  { label: 'Rating', value: `${tutor.rating || 0}/5`, icon: '⭐' },
                  { label: 'Reviews', value: tutor.reviews || 0, icon: '💬' },
                  { label: 'Price/hr', value: `Rs ${tutor.price || 0}`, icon: '💰' },
                ].map(stat => (
                  <div key={stat.label} style={{
                    background: '#f9f9ff', borderRadius: 12,
                    padding: '1rem', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.5rem' }}>{stat.icon}</div>
                    <div style={{
                      fontSize: '1.2rem', fontWeight: 700,
                      color: 'var(--dark)'
                    }}>{stat.value}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses */}
            {courses.length > 0 && (
              <div className="tutor-profile__section">
                <h2 className="tutor-profile__section-title">My Courses</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {courses.map((c: any) => (
                    <Link
                      to={`/courses/${c._id}`}
                      key={c._id}
                      style={{
                        background: '#f9f9ff', borderRadius: 12,
                        padding: '1rem', textDecoration: 'none',
                        color: 'inherit', border: '1.5px solid transparent',
                        transition: 'border-color 0.2s', display: 'block'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <p style={{
                            fontWeight: 700, color: 'var(--dark)',
                            marginBottom: '0.25rem'
                          }}>{c.title}</p>
                          <p style={{ fontSize: '0.82rem', color: 'var(--gray)' }}>
                            {c.subject} · {c.level}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{
                            color: 'var(--orange)', fontWeight: 700
                          }}>Rs {c.price}/hr</p>
                          <p style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>
                            ⭐ {c.rating} · {c.studentsEnrolled} students
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="tutor-profile__sidebar">
            <div className="tutor-profile__booking-card">
              <div className="tutor-profile__rate">
                <span className="tutor-profile__rate-value">
                  Rs {tutor.price || 0}
                </span>
                <span className="tutor-profile__rate-label">/ hour</span>
              </div>

              <Link to={`/booking?tutorId=${tutor._id}&tutorName=${encodeURIComponent(tutor.name)}&subject=${encodeURIComponent(tutor.subject)}&price=${tutor.price}`} className="tutor-profile__book-btn">
                Book a Session
              </Link>
              

              <div className="tutor-profile__card-stats">
                <div className="tutor-profile__card-stat">
                  <span className="tutor-profile__card-stat-value">
                    {tutor.rating || 0}
                  </span>
                  <span className="tutor-profile__card-stat-label">Rating</span>
                </div>
                <div className="tutor-profile__card-stat">
                  <span className="tutor-profile__card-stat-value">
                    {tutor.sessions || 0}
                  </span>
                  <span className="tutor-profile__card-stat-label">Sessions</span>
                </div>
                <div className="tutor-profile__card-stat">
                  <span className="tutor-profile__card-stat-value">
                    {tutor.reviews || 0}
                  </span>
                  <span className="tutor-profile__card-stat-label">Reviews</span>
                </div>
              </div>

              <div style={{
                marginTop: '1rem', padding: '1rem',
                background: '#f9f9ff', borderRadius: 10
              }}>
                <p style={{
                  fontSize: '0.82rem', fontWeight: 700,
                  color: 'var(--dark)', marginBottom: '0.5rem'
                }}>
                  📧 Contact
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--gray)' }}>
                  {tutor.email}
                </p>
                {tutor.city && (
                  <p style={{
                    fontSize: '0.82rem', color: 'var(--gray)',
                    marginTop: '0.25rem'
                  }}>
                    📍 {tutor.city}
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <footer className="footer">
        <p>2024 eTutor. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default TutorProfile