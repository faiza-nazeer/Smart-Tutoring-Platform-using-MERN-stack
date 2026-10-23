import { useState } from "react";
import "./TutorSessions.css";

const sessions = [
  { id: 1, student: "Ahmed Khan", subject: "Mathematics", date: "Today", time: "5:00 PM", duration: "1 hr", avatar: "AK", type: "upcoming" },
  { id: 2, student: "Fatima Tariq", subject: "Mathematics", date: "Today", time: "7:00 PM", duration: "1 hr", avatar: "FT", type: "upcoming" },
  { id: 3, student: "Hassan Ali", subject: "Mathematics", date: "Tomorrow", time: "3:00 PM", duration: "1 hr", avatar: "HA", type: "upcoming" },
  { id: 4, student: "Zara Imran", subject: "Mathematics", date: "Sat, 30 Apr", time: "11:00 AM", duration: "1 hr", avatar: "ZI", type: "upcoming" },
  { id: 5, student: "Ahmed Khan", subject: "Mathematics", date: "Mon, 22 Apr", time: "5:00 PM", duration: "1 hr", avatar: "AK", type: "completed" },
  { id: 6, student: "Fatima Tariq", subject: "Mathematics", date: "Fri, 19 Apr", time: "7:00 PM", duration: "1 hr", avatar: "FT", type: "completed" },
  { id: 7, student: "Bilal Shah", subject: "Mathematics", date: "Wed, 17 Apr", time: "4:00 PM", duration: "1 hr", avatar: "BS", type: "cancelled" },
];

const typeBadge: Record<string, { label: string; cls: string }> = {
  upcoming:  { label: "Upcoming",  cls: "badge-upcoming" },
  completed: { label: "Completed", cls: "badge-done" },
  cancelled: { label: "Cancelled", cls: "badge-cancelled" },
};

export default function TutorSessions() {
  const [tab, setTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const filtered = sessions.filter(s => s.type === tab);

  return (
    <div className="ts-page">
      <div className="ts-header">
        <div>
          <h1>My Sessions</h1>
          <p>Manage all your tutoring sessions</p>
        </div>
        <div className="ts-stats-mini">
          <div><strong>4</strong><span>Upcoming</span></div>
          <div><strong>340</strong><span>Total Done</span></div>
          <div><strong>18h</strong><span>This Month</span></div>
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
            <span className="ts-tab-count">{sessions.filter(s => s.type === t).length}</span>
          </button>
        ))}
      </div>

      <div className="ts-list">
        {filtered.length === 0 ? (
          <div className="ts-empty">No {tab} sessions found.</div>
        ) : filtered.map(s => (
          <div className="ts-card" key={s.id}>
            <div className="ts-avatar">{s.avatar}</div>
            <div className="ts-card__info">
              <h4>{s.student}</h4>
              <p>{s.subject}</p>
            </div>
            <div className="ts-card__time">
              <span className="ts-date">{s.date}</span>
              <span>{s.time} · {s.duration}</span>
            </div>
            <span className={`ts-badge ${typeBadge[s.type].cls}`}>{typeBadge[s.type].label}</span>
            {s.type === "upcoming" && <button className="ts-start-btn">Start</button>}
            {s.type === "completed" && <button className="ts-notes-btn">📝 Notes</button>}
          </div>
        ))}
      </div>
    </div>
  );
}