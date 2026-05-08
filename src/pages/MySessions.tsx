import "./MySessions.css";

type Session = {
  id: number;
  tutor: string;
  subject: string;
  initials: string;
  date: string;
  time: string;
  duration: string;
  type: "upcoming" | "completed" | "cancelled";
  topic: string;
};

const sessions: Session[] = [
  { id: 1, tutor: "Ayesha Khan", subject: "Mathematics", initials: "AK", date: "Today", time: "5:00 PM", duration: "1 hr", type: "upcoming", topic: "Quadratic Equations" },
  { id: 2, tutor: "Zain Ahmed", subject: "Physics", initials: "ZA", date: "Tomorrow", time: "4:00 PM", duration: "1 hr", type: "upcoming", topic: "Newton's Laws" },
  { id: 3, tutor: "Sara Raza", subject: "English", initials: "SR", date: "Sat, 30 Apr", time: "3:00 PM", duration: "1 hr", type: "upcoming", topic: "Essay Writing" },
  { id: 4, tutor: "Ayesha Khan", subject: "Mathematics", initials: "AK", date: "Mon, 22 Apr", time: "5:00 PM", duration: "1 hr", type: "completed", topic: "Trigonometry" },
  { id: 5, tutor: "Zain Ahmed", subject: "Physics", initials: "ZA", date: "Fri, 19 Apr", time: "4:00 PM", duration: "1 hr", type: "completed", topic: "Optics" },
  { id: 6, tutor: "Omar Farooq", subject: "Chemistry", initials: "OF", date: "Wed, 17 Apr", time: "6:00 PM", duration: "1 hr", type: "cancelled", topic: "Periodic Table" },
];

const typeBadge = {
  upcoming: { label: "Upcoming", cls: "badge-upcoming" },
  completed: { label: "Completed", cls: "badge-done" },
  cancelled: { label: "Cancelled", cls: "badge-cancelled" },
};

export default function MySessions() {
  const upcoming = sessions.filter(s => s.type === "upcoming");
  const past = sessions.filter(s => s.type !== "upcoming");

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
        <div className="sstat"><span className="snum">3</span><span className="slabel">Upcoming</span></div>
        <div className="sstat"><span className="snum">12</span><span className="slabel">Completed</span></div>
        <div className="sstat"><span className="snum">18h</span><span className="slabel">Total Hours</span></div>
      </div>

      <section className="sessions-section">
        <h2>Upcoming Sessions</h2>
        <div className="sessions-list">
          {upcoming.map(s => (
            <div key={s.id} className="session-card">
              <div className="session-avatar">{s.initials}</div>
              <div className="session-info">
                <h4>{s.tutor}</h4>
                <p>{s.subject} · {s.topic}</p>
              </div>
              <div className="session-time">
                <span className="session-date">{s.date}</span>
                <span>{s.time} · {s.duration}</span>
              </div>
              <span className={`badge ${typeBadge[s.type].cls}`}>{typeBadge[s.type].label}</span>
              <button className="join-btn">Join</button>
            </div>
          ))}
        </div>
      </section>

      <section className="sessions-section">
        <h2>Past Sessions</h2>
        <div className="sessions-list">
          {past.map(s => (
            <div key={s.id} className="session-card past">
              <div className="session-avatar faded">{s.initials}</div>
              <div className="session-info">
                <h4>{s.tutor}</h4>
                <p>{s.subject} · {s.topic}</p>
              </div>
              <div className="session-time">
                <span className="session-date">{s.date}</span>
                <span>{s.time} · {s.duration}</span>
              </div>
              <span className={`badge ${typeBadge[s.type].cls}`}>{typeBadge[s.type].label}</span>
              {s.type === "completed" && <button className="review-btn">★ Rate</button>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}