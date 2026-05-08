import { useState } from "react";
import "./TutorCourses.css";

const courses = [
  { id: 1, title: "Master Mathematics", students: 18, progress: 75, rating: 4.9, reviews: 42, status: "active", sessions: 24 },
  { id: 2, title: "Advanced Algebra", students: 12, progress: 55, rating: 4.7, reviews: 28, status: "active", sessions: 16 },
  { id: 3, title: "Calculus Fundamentals", students: 18, progress: 90, rating: 4.8, reviews: 35, status: "active", sessions: 30 },
  { id: 4, title: "Basic Arithmetic", students: 22, progress: 100, rating: 4.6, reviews: 58, status: "completed", sessions: 20 },
];

export default function TutorCourses() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="tc-page">
      <div className="tc-header">
        <div>
          <h1>My Courses</h1>
          <p>Manage the courses you teach</p>
        </div>
        <button className="tc-add-btn" onClick={() => setShowModal(true)}>+ Create Course</button>
      </div>

      <div className="tc-stats">
        <div className="tc-stat"><strong>4</strong><span>Total Courses</span></div>
        <div className="tc-stat"><strong>70</strong><span>Total Students</span></div>
        <div className="tc-stat"><strong>4.8</strong><span>Avg Rating</span></div>
        <div className="tc-stat"><strong>90</strong><span>Total Sessions</span></div>
      </div>

      <div className="tc-grid">
        {courses.map(c => (
          <div className="tc-card" key={c.id}>
            <div className="tc-card__top">
              <div className="tc-card__icon">📚</div>
              <div className="tc-card__title-wrap">
                <h3>{c.title}</h3>
                <span className={`tc-status ${c.status === "completed" ? "tc-status--done" : "tc-status--active"}`}>
                  {c.status === "completed" ? "✓ Completed" : "● Active"}
                </span>
              </div>
            </div>

            <div className="tc-card__stats">
              <div><strong>{c.students}</strong><span>Students</span></div>
              <div><strong>{c.sessions}</strong><span>Sessions</span></div>
              <div><strong>⭐ {c.rating}</strong><span>({c.reviews})</span></div>
            </div>

            <div className="tc-card__progress">
              <div className="tc-progress-label">
                <span>Course Progress</span>
                <span>{c.progress}%</span>
              </div>
              <div className="tc-progress-bar">
                <div className="tc-progress-fill" style={{ width: `${c.progress}%` }} />
              </div>
            </div>

            <div className="tc-card__actions">
              <button className="tc-btn-outline">View Details</button>
              <button className="tc-btn-primary">Manage</button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Course Modal */}
      {showModal && (
        <div className="tc-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="tc-modal" onClick={e => e.stopPropagation()}>
            <h2>Create New Course</h2>
            <div className="tc-modal-field">
              <label>Course Title</label>
              <input type="text" placeholder="e.g. Master Mathematics" />
            </div>
            <div className="tc-modal-field">
              <label>Subject</label>
              <input type="text" placeholder="e.g. Mathematics" />
            </div>
            <div className="tc-modal-field">
              <label>Level</label>
              <select>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="tc-modal-field">
              <label>Price per Session (Rs)</label>
              <input type="number" placeholder="e.g. 1500" />
            </div>
            <div className="tc-modal-actions">
              <button className="tc-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="tc-btn-primary" onClick={() => setShowModal(false)}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}