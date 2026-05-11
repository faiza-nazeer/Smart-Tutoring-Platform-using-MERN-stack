import { useState, useEffect } from "react";
import "./TutorSessions.css";
import { useAuth } from "../context/AuthContext";

const typeBadge: Record<string, { label: string; cls: string }> = {
  Confirmed: { label: "Confirmed", cls: "badge-upcoming" },
  Pending:   { label: "Pending",   cls: "badge-upcoming" },
  Completed: { label: "Completed", cls: "badge-done" },
  Cancelled: { label: "Cancelled", cls: "badge-cancelled" },
};

export default function TutorSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");

  useEffect(() => {
    fetch('http://localhost:5000/api/bookings')
      .then(res => res.json())
      .then((data: any[]) => {
        const mySessions = data.filter(b => b.tutor?._id === user?._id);
        setSessions(mySessions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const upcoming = sessions.filter(s =>
    s.status === 'Pending' || s.status === 'Confirmed'
  );
  const completed = sessions.filter(s => s.status === 'Completed');
  const cancelled = sessions.filter(s => s.status === 'Cancelled');

  const getFiltered = () => {
    if (tab === 'upcoming') return upcoming;
    if (tab === 'completed') return completed;
    return cancelled;
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    await fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setSessions(prev =>
      prev.map(s => s._id === id ? { ...s, status } : s)
    );
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading sessions...</div>;

  return (
    <div className="ts-page">
      <div className="ts-header">
        <div>
          <h1>My Sessions</h1>
          <p>Manage all your tutoring sessions</p>
        </div>
        <div className="ts-stats-mini">
          <div><strong>{upcoming.length}</strong><span>Upcoming</span></div>
          <div><strong>{completed.length}</strong><span>Completed</span></div>
          <div><strong>{sessions.length}</strong><span>Total</span></div>
        </div>
      </div>

      <div className="ts-tabs">
        {(["upcoming", "completed", "cancelled"] as const).map(t => (
          <button
            key={t}
            className={`ts-tab ${tab === t ? "ts-tab--active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            <span className="ts-tab-count">
              {t === 'upcoming' ? upcoming.length :
               t === 'completed' ? completed.length : cancelled.length}
            </span>
          </button>
        ))}
      </div>

      <div className="ts-list">
        {getFiltered().length === 0 ? (
          <div className="ts-empty">No {tab} sessions found.</div>
        ) : (
          getFiltered().map(s => (
            <div className="ts-card" key={s._id}>
              <div className="ts-avatar">
                {s.student?.name?.slice(0, 2).toUpperCase()}
              </div>
              <div className="ts-card__info">
                <h4>{s.student?.name}</h4>
                <p>{s.subject}</p>
              </div>
              <div className="ts-card__time">
                <span className="ts-date">{s.date}</span>
                <span>{s.time} · {s.duration}</span>
              </div>
              <span className={`ts-badge ${typeBadge[s.status]?.cls || 'badge-upcoming'}`}>
                {typeBadge[s.status]?.label || s.status}
              </span>
              {tab === 'upcoming' && (
                <>
                  <button
                    className="ts-start-btn"
                    onClick={() => window.open('https://meet.google.com', '_blank')}
                  >
                    Start
                  </button>
                  <button
                    className="ts-notes-btn"
                    onClick={() => handleStatusUpdate(s._id, 'Completed')}
                  >
                    ✓ Complete
                  </button>
                </>
              )}
              {tab === 'completed' && (
                <button className="ts-notes-btn">📝 Notes</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}