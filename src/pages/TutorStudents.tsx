import "./TutorStudents.css";

const students = [
  { id: 1, name: "Ahmed Khan", course: "Master Mathematics", progress: 65, sessions: 8, lastSeen: "Today", avatar: "AK", rating: 5 },
  { id: 2, name: "Fatima Tariq", course: "Advanced Algebra", progress: 40, sessions: 5, lastSeen: "Yesterday", avatar: "FT", rating: 5 },
  { id: 3, name: "Hassan Ali", course: "Calculus Fundamentals", progress: 80, sessions: 12, lastSeen: "2 days ago", avatar: "HA", rating: 4 },
  { id: 4, name: "Zara Imran", course: "Master Mathematics", progress: 55, sessions: 6, lastSeen: "3 days ago", avatar: "ZI", rating: 5 },
  { id: 5, name: "Bilal Shah", course: "Advanced Algebra", progress: 30, sessions: 3, lastSeen: "1 week ago", avatar: "BS", rating: 4 },
  { id: 6, name: "Nadia Iqbal", course: "Calculus Fundamentals", progress: 90, sessions: 15, lastSeen: "Today", avatar: "NI", rating: 5 },
];

export default function TutorStudents() {
  return (
    <div className="tstu-page">
      <div className="tstu-header">
        <div>
          <h1>My Students</h1>
          <p>Track all your enrolled students</p>
        </div>
        <div className="tstu-stats-mini">
          <div><strong>48</strong><span>Total Students</span></div>
          <div><strong>6</strong><span>Active Now</span></div>
        </div>
      </div>

      <div className="tstu-grid">
        {students.map(s => (
          <div className="tstu-card" key={s.id}>
            <div className="tstu-card__top">
              <div className="tstu-avatar">{s.avatar}</div>
              <div className="tstu-card__info">
                <h3>{s.name}</h3>
                <p>{s.course}</p>
              </div>
              <span className="tstu-last-seen">{s.lastSeen}</span>
            </div>

            <div className="tstu-card__progress">
              <div className="tstu-progress-label">
                <span>Progress</span>
                <span>{s.progress}%</span>
              </div>
              <div className="tstu-progress-bar">
                <div className="tstu-progress-fill" style={{ width: `${s.progress}%` }} />
              </div>
            </div>

            <div className="tstu-card__footer">
              <span>📅 {s.sessions} sessions</span>
              <span>{'⭐'.repeat(s.rating)}</span>
            </div>

            <div className="tstu-card__actions">
              <button className="tstu-btn-outline">View Profile</button>
              <button className="tstu-btn-primary">Message</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}