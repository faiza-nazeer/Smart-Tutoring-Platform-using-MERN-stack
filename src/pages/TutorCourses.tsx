import { useState, useEffect } from "react";
import "./TutorCourses.css";
import { useAuth } from "../context/AuthContext";

export default function TutorCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '', subject: '', level: 'Beginner', price: '', description: ''
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then((data: any[]) => {
        const myCourses = data.filter(c => c.tutor?._id === user?._id);
        setCourses(myCourses);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleCreate = async () => {
    if (!newCourse.title || !newCourse.subject || !newCourse.price) return;
    try {
      const res = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCourse,
          tutor: user?._id,
          price: parseInt(newCourse.price),
          status: 'Draft',
        }),
      });
      const created = await res.json();
      setCourses(prev => [...prev, created]);
      setShowModal(false);
      setNewCourse({ title: '', subject: '', level: 'Beginner', price: '', description: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this course?')) return;
    await fetch(`http://localhost:5000/api/courses/${id}`, { method: 'DELETE' });
    setCourses(prev => prev.filter(c => c._id !== id));
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading courses...</div>;

  return (
    <div className="tc-page">
      <div className="tc-header">
        <div>
          <h1>My Courses</h1>
          <p>Manage the courses you teach</p>
        </div>
        <button className="tc-add-btn" onClick={() => setShowModal(true)}>
          + Create Course
        </button>
      </div>

      <div className="tc-stats">
        <div className="tc-stat">
          <strong>{courses.length}</strong>
          <span>Total Courses</span>
        </div>
        <div className="tc-stat">
          <strong>
            {courses.reduce((sum, c) => sum + (c.studentsEnrolled || 0), 0)}
          </strong>
          <span>Total Students</span>
        </div>
        <div className="tc-stat">
          <strong>
            {courses.length > 0
              ? (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length).toFixed(1)
              : 0}
          </strong>
          <span>Avg Rating</span>
        </div>
        <div className="tc-stat">
          <strong>{courses.filter(c => c.status === 'Published').length}</strong>
          <span>Published</span>
        </div>
      </div>

      {courses.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '3rem',
          background: 'white', borderRadius: 14, color: 'var(--gray)'
        }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            You haven't created any courses yet
          </p>
          <button className="tc-add-btn" onClick={() => setShowModal(true)}>
            + Create Your First Course
          </button>
        </div>
      ) : (
        <div className="tc-grid">
          {courses.map(c => (
            <div className="tc-card" key={c._id}>
              <div className="tc-card__top">
                <div className="tc-card__icon">📚</div>
                <div className="tc-card__title-wrap">
                  <h3>{c.title}</h3>
                  <span className={`tc-status ${c.status === 'Published' ? 'tc-status--active' : 'tc-status--done'}`}>
                    {c.status === 'Published' ? '● Published' : '● Draft'}
                  </span>
                </div>
              </div>

              <div className="tc-card__stats">
                <div>
                  <strong>{c.studentsEnrolled || 0}</strong>
                  <span>Students</span>
                </div>
                <div>
                  <strong>⭐ {c.rating || 0}</strong>
                  <span>Rating</span>
                </div>
                <div>
                  <strong>Rs {c.price}</strong>
                  <span>Per Hour</span>
                </div>
              </div>

              <div style={{
                fontSize: '0.82rem', color: 'var(--gray)',
                marginBottom: '0.75rem'
              }}>
                {c.description || 'No description provided.'}
              </div>

              <div className="tc-card__actions">
                <button
                  className="tc-btn-outline"
                  onClick={() => handleDelete(c._id)}
                >
                  Delete
                </button>
                <button
                  className="tc-btn-primary"
                  onClick={async () => {
                    const newStatus = c.status === 'Published' ? 'Draft' : 'Published';
                    await fetch(`http://localhost:5000/api/courses/${c._id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: newStatus }),
                    });
                    setCourses(prev =>
                      prev.map(course =>
                        course._id === c._id
                          ? { ...course, status: newStatus }
                          : course
                      )
                    );
                  }}
                >
                  {c.status === 'Published' ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="tc-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="tc-modal" onClick={e => e.stopPropagation()}>
            <h2>Create New Course</h2>
            <div className="tc-modal-field">
              <label>Course Title</label>
              <input
                type="text"
                placeholder="e.g. Master Mathematics"
                value={newCourse.title}
                onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
              />
            </div>
            <div className="tc-modal-field">
              <label>Subject</label>
              <input
                type="text"
                placeholder="e.g. Mathematics"
                value={newCourse.subject}
                onChange={e => setNewCourse({ ...newCourse, subject: e.target.value })}
              />
            </div>
            <div className="tc-modal-field">
              <label>Level</label>
              <select
                value={newCourse.level}
                onChange={e => setNewCourse({ ...newCourse, level: e.target.value })}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>All Levels</option>
              </select>
            </div>
            <div className="tc-modal-field">
              <label>Price per Hour (Rs)</label>
              <input
                type="number"
                placeholder="e.g. 1500"
                value={newCourse.price}
                onChange={e => setNewCourse({ ...newCourse, price: e.target.value })}
              />
            </div>
            <div className="tc-modal-field">
              <label>Description</label>
              <input
                type="text"
                placeholder="Brief description of your course"
                value={newCourse.description}
                onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
              />
            </div>
            <div className="tc-modal-actions">
              <button className="tc-btn-outline" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="tc-btn-primary" onClick={handleCreate}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}