import { useEffect, useState } from "react";
import "./TutorStudents.css";
import { useAuth } from "../context/AuthContext";
export default function TutorStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('http://localhost:5000/api/bookings')
      .then(res => res.json())
      .then((data: any[]) => {
        const myBookings = data.filter(b => b.tutor?._id === user?._id);

        // Get unique students
        const studentMap = new Map();
        myBookings.forEach((b: any) => {
          if (b.student?._id && !studentMap.has(b.student._id)) {
            studentMap.set(b.student._id, {
              _id: b.student._id,
              name: b.student.name,
              email: b.student.email,
              sessions: myBookings.filter(
                (s: any) => s.student?._id === b.student._id
              ).length,
              lastSession: b.date,
              subject: b.subject,
              status: b.status,
            });
          }
        });

        setStudents(Array.from(studentMap.values()));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading students...</div>;

  return (
    <div className="tstu-page">
      <div className="tstu-header">
        <div>
          <h1>My Students</h1>
          <p>Track all your enrolled students</p>
        </div>
        <div className="tstu-stats-mini">
          <div>
            <strong>{students.length}</strong>
            <span>Total Students</span>
          </div>
          <div>
            <strong>
              {students.filter(s => s.status === 'Confirmed' || s.status === 'Pending').length}
            </strong>
            <span>Active</span>
          </div>
        </div>
      </div>

      {students.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '3rem',
          background: 'white', borderRadius: 14, color: 'var(--gray)'
        }}>
          <p>No students yet. Share your profile to get bookings!</p>
        </div>
      ) : (
        <div className="tstu-grid">
          {students.map(s => (
            <div className="tstu-card" key={s._id}>
              <div className="tstu-card__top">
                <div className="tstu-avatar">
                  {s.name?.slice(0, 2).toUpperCase()}
                </div>
                <div className="tstu-card__info">
                  <h3>{s.name}</h3>
                  <p>{s.subject}</p>
                </div>
                <span className="tstu-last-seen">{s.lastSession}</span>
              </div>

              <div className="tstu-card__progress">
                <div className="tstu-progress-label">
                  <span>Sessions Booked</span>
                  <span>{s.sessions}</span>
                </div>
                <div className="tstu-progress-bar">
                  <div
                    className="tstu-progress-fill"
                    style={{ width: `${Math.min((s.sessions / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="tstu-card__footer">
                <span>📧 {s.email}</span>
                <span style={{
                  padding: '3px 10px', borderRadius: 20,
                  fontSize: '0.75rem', fontWeight: 600,
                  background: s.status === 'Confirmed' ? '#e6faf0' : '#fff8e1',
                  color: s.status === 'Confirmed' ? '#27ae60' : '#f57f17'
                }}>
                  {s.status}
                </span>
              </div>

              <div className="tstu-card__actions">
                <button className="tstu-btn-outline">View Profile</button>
                
              </div>
            </div>
          ))}
        </div>
      )}
    
    </div>
  );
}