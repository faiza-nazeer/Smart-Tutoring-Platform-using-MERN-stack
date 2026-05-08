import { Link } from "react-router-dom";
import "./MyCourses.css";

const courses = [
  {
    id: 1,
    title: "Master Mathematics",
    tutor: "Ayesha Khan",
    subject: "Mathematics",
    progress: 65,
    initials: "AK",
    sessions: 8,
    nextSession: "Today, 5:00 PM",
    status: "active",
  },
  {
    id: 2,
    title: "Physics for Intermediate",
    tutor: "Zain Ahmed",
    subject: "Physics",
    progress: 40,
    initials: "ZA",
    sessions: 5,
    nextSession: "Tomorrow, 4:00 PM",
    status: "active",
  },
  {
    id: 3,
    title: "English Grammar Masterclass",
    tutor: "Sara Raza",
    subject: "English",
    progress: 80,
    initials: "SR",
    sessions: 10,
    nextSession: "Sat, 30 Apr, 3:00 PM",
    status: "active",
  },
  {
    id: 4,
    title: "Chemistry Basics",
    tutor: "Omar Farooq",
    subject: "Chemistry",
    progress: 100,
    initials: "OF",
    sessions: 12,
    nextSession: "Completed",
    status: "completed",
  },
];

export default function MyCourses() {
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
          <span className="stat-num">3</span>
          <span className="stat-label">Active Courses</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">1</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">62%</span>
          <span className="stat-label">Avg Progress</span>
        </div>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className={`course-card ${course.status === "completed" ? "completed" : ""}`}>
            <div className="course-card-header">
              <div className="tutor-avatar">{course.initials}</div>
              <div className="course-meta">
                <h3>{course.title}</h3>
                <p>{course.tutor} · {course.subject}</p>
              </div>
              {course.status === "completed" && (
                <span className="badge-completed">✓ Done</span>
              )}
            </div>

            <div className="progress-section">
              <div className="progress-label">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${course.progress}%` }} />
              </div>
            </div>

            <div className="course-card-footer">
              <div className="session-info">
                <span>📅</span>
                <span>{course.nextSession}</span>
              </div>
              <div className="session-count">{course.sessions} sessions</div>
            </div>

            <div className="course-actions">
              <Link to={`/courses/${course.id}`} className="btn-outline">View Course</Link>
              {course.status !== "completed" && (
                <Link to="/booking" className="btn-primary-sm">Book Session</Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}