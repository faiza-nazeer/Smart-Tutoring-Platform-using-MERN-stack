import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./MySessions.css";

type Session = {
  _id: string;
  tutor: any;
  subject: string;
  date: string;
  time: string;
  duration: string;
  status: string;
  notes?: string;
};

const typeBadge: Record<string, { label: string; cls: string }> = {
  Confirmed: { label: "Confirmed", cls: "badge-upcoming" },
  Pending:   { label: "Pending",   cls: "badge-upcoming" },
  Completed: { label: "Completed", cls: "badge-done" },
  Cancelled: { label: "Cancelled", cls: "badge-cancelled" },
};

export default function MySessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/bookings')
      .then(res => res.json())
      .then((data: any[]) => {
        const mySessions = data.filter(b => b.student?._id === user?._id);
        setSessions(mySessions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const upcoming = sessions.filter(s =>
    s.status === 'Pending' || s.status === 'Confirmed'
  );
  const past = sessions.filter(s =>
    s.status === 'Completed' || s.status === 'Cancelled'
  );

  if (loading) return <div style={{ padding: '2rem' }}>Loading sessions...</div>;

  return (
    <div className="my-sessions-page">
      <div className="page-header">
        <div>
          <h1>My Sessions</h1>
          <p>Manage and review your tutoring sessions</p>
        </div>
        <a href="/booking" className="btn-primary-orange">+ Book a Session</a>
      </div>

      <div className="sessions-stats">
        <div className="sstat">
          <span className="snum">{upcoming.length}</span>
          <span className="slabel">Upcoming</span>
        </div>
        <div className="sstat">
          <span className="snum">{past.filter(s => s.status === 'Completed').length}</span>
          <span className="slabel">Completed</span>
        </div>
        <div className="sstat">
          <span className="snum">{sessions.length}</span>
          <span className="slabel">Total</span>
        </div>
      </div>

      <section className="sessions-section">
        <h2>Upcoming Sessions</h2>
        {upcoming.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '2rem',
            background: 'white', borderRadius: 12, color: 'var(--gray)'
          }}>
            <p>No upcoming sessions</p>
            <a href="/booking" style={{ color: 'var(--purple)', fontWeight: 600 }}>
              Book a session →
            </a>
          </div>
        ) : (
          <div className="sessions-list">
            {upcoming.map(s => (
              <div key={s._id} className="session-card">
                <div className="session-avatar">
                  {s.tutor?.name?.slice(0, 2).toUpperCase()}
                </div>
                <div className="session-info">
                  <h4>{s.tutor?.name}</h4>
                  <p>{s.subject}</p>
                </div>
                <div className="session-time">
                  <span className="session-date">{s.date}</span>
                  <span>{s.time} · {s.duration}</span>
                </div>
                <span className={`badge ${typeBadge[s.status]?.cls || 'badge-upcoming'}`}>
                  {typeBadge[s.status]?.label || s.status}
                </span>
                <button
                  className="join-btn"
                  onClick={() => window.open('https://meet.google.com', '_blank')}
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="sessions-section">
        <h2>Past Sessions</h2>
        {past.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '2rem',
            background: 'white', borderRadius: 12, color: 'var(--gray)'
          }}>
            <p>No past sessions yet</p>
          </div>
        ) : (
          <div className="sessions-list">
            {past.map(s => (
              <div key={s._id} className="session-card past">
                <div className="session-avatar faded">
                  {s.tutor?.name?.slice(0, 2).toUpperCase()}
                </div>
                <div className="session-info">
                  <h4>{s.tutor?.name}</h4>
                  <p>{s.subject}</p>
                </div>
                <div className="session-time">
                  <span className="session-date">{s.date}</span>
                  <span>{s.time} · {s.duration}</span>
                </div>
                <span className={`badge ${typeBadge[s.status]?.cls || 'badge-done'}`}>
                  {typeBadge[s.status]?.label || s.status}
                </span>
                {s.status === 'Completed' && (
                  <button className="review-btn">★ Rate</button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}