import { Link } from "react-router-dom";
import "./MyCourses.css";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function MyCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then((data: any[]) => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading courses...</div>;

  return (
    <div className="my-courses-page">
      <div className="page-header">
        <div>
          <h1>My Courses</h1>
          <p>Track your enrolled courses and progress</p>
        </div>
        <Link to="/courses" className="btn-primary">+ Explore Courses</Link>
      </div>

      <div className="courses-stats">
        <div className="stat-card">
          <span className="stat-num">{courses.length}</span>
          <span className="stat-label">Available Courses</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">
            {courses.filter(c => c.level === 'Beginner').length}
          </span>
          <span className="stat-label">Beginner</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">
            {courses.filter(c => c.level === 'Advanced').length}
          </span>
          <span className="stat-label">Advanced</span>
        </div>
      </div>

      {courses.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '3rem',
          background: 'white', borderRadius: 14, color: 'var(--gray)'
        }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            No courses available yet
          </p>
          <Link to="/courses" style={{ color: 'var(--purple)', fontWeight: 600 }}>
            Browse Courses →
          </Link>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <div className="course-card-header">
                <div className="tutor-avatar">
                  {course.tutor?.name?.slice(0, 2).toUpperCase()}
                </div>
                <div className="course-meta">
                  <h3>{course.title}</h3>
                  <p>{course.tutor?.name} · {course.subject}</p>
                </div>
              </div>

              <div className="course-card-footer">
                <div className="session-info">
                  <span>📚</span>
                  <span>{course.level}</span>
                </div>
                <div className="session-count">
                  ⭐ {course.rating} · {course.studentsEnrolled} students
                </div>
              </div>

              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '1rem'
              }}>
                <span style={{ color: 'var(--orange)', fontWeight: 700, fontSize: '1.1rem' }}>
                  Rs {course.price}/hr
                </span>
                <span style={{
                  background: '#e8f5e9', color: '#27ae60',
                  padding: '3px 10px', borderRadius: 20,
                  fontSize: '0.78rem', fontWeight: 600
                }}>
                  {course.status}
                </span>
              </div>

              <div className="course-actions">
                <Link to={`/courses/${course._id}`} className="btn-outline">
                  View Course
                </Link>
                <Link
                  to={`/booking?tutorId=${course.tutor?._id}&tutorName=${encodeURIComponent(course.tutor?.name || '')}&subject=${encodeURIComponent(course.subject)}&price=${course.price}`}
                  className="btn-primary-sm"
                >
                  Book Session
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}