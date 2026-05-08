import { useState } from "react";
import { Link } from "react-router-dom";
import "./FindTutors.css";

const tutors = [
  { id: 1, name: "Ayesha Khan", subject: "Mathematics", rating: 4.9, reviews: 124, price: 1500, initials: "AK", city: "Lahore", level: "Intermediate", sessions: 340, available: true },
  { id: 2, name: "Zain Ahmed", subject: "Physics", rating: 4.7, reviews: 89, price: 1200, initials: "ZA", city: "Karachi", level: "Intermediate", sessions: 210, available: true },
  { id: 3, name: "Sara Raza", subject: "English", rating: 4.8, reviews: 102, price: 1000, initials: "SR", city: "Islamabad", level: "Beginner", sessions: 275, available: false },
  { id: 4, name: "Omar Farooq", subject: "Chemistry", rating: 4.6, reviews: 67, price: 1300, initials: "OF", city: "Lahore", level: "Advanced", sessions: 180, available: true },
  { id: 5, name: "Hina Malik", subject: "Biology", rating: 4.9, reviews: 145, price: 1400, initials: "HM", city: "Karachi", level: "Intermediate", sessions: 390, available: true },
  { id: 6, name: "Bilal Siddiqui", subject: "Computer Science", rating: 4.8, reviews: 98, price: 1800, initials: "BS", city: "Islamabad", level: "Advanced", sessions: 220, available: false },
];

const subjects = ["All", "Mathematics", "Physics", "English", "Chemistry", "Biology", "Computer Science"];
const cities = ["All", "Lahore", "Karachi", "Islamabad"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function FindTutors() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [city, setCity] = useState("All");
  const [level, setLevel] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filtered = tutors.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subject === "All" || t.subject === subject;
    const matchCity = city === "All" || t.city === city;
    const matchLevel = level === "All" || t.level === level;
    const matchAvailable = !onlyAvailable || t.available;
    return matchSearch && matchSubject && matchCity && matchLevel && matchAvailable;
  });

  return (
    <div className="ft-page">
      <div className="ft-header">
        <h1>Find a Tutor</h1>
        <p>Browse expert tutors and book your first session today</p>
      </div>

      {/* Search + Filters */}
      <div className="ft-filters">
        <input
          className="ft-search"
          type="text"
          placeholder="🔍 Search by name or subject..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="ft-filter-row">
          <select value={subject} onChange={e => setSubject(e.target.value)}>
            {subjects.map(s => <option key={s}>{s}</option>)}
          </select>

          <select value={city} onChange={e => setCity(e.target.value)}>
            {cities.map(c => <option key={c}>{c}</option>)}
          </select>

          <select value={level} onChange={e => setLevel(e.target.value)}>
            {levels.map(l => <option key={l}>{l}</option>)}
          </select>

          <label className="ft-toggle-label">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={e => setOnlyAvailable(e.target.checked)}
            />
            Available only
          </label>
        </div>
      </div>

      <p className="ft-results-count">{filtered.length} tutor{filtered.length !== 1 ? "s" : ""} found</p>

      {/* Tutor Cards */}
      <div className="ft-grid">
        {filtered.length === 0 ? (
          <div className="ft-empty">No tutors found. Try adjusting your filters.</div>
        ) : (
          filtered.map(t => (
            <div className="ft-card" key={t.id}>
              <div className="ft-card__top">
                <div className="ft-card__avatar">{t.initials}</div>
                <div className="ft-card__info">
                  <h3>{t.name}</h3>
                  <p>{t.subject} · {t.city}</p>
                  <span className={`ft-card__avail ${t.available ? "avail-yes" : "avail-no"}`}>
                    {t.available ? "● Available" : "● Unavailable"}
                  </span>
                </div>
              </div>

              <div className="ft-card__stats">
                <div className="ft-card__stat">
                  <strong>⭐ {t.rating}</strong>
                  <span>({t.reviews} reviews)</span>
                </div>
                <div className="ft-card__stat">
                  <strong>{t.sessions}</strong>
                  <span>Sessions</span>
                </div>
                <div className="ft-card__stat">
                  <strong>Rs {t.price}</strong>
                  <span>per hour</span>
                </div>
              </div>

              <div className="ft-card__tags">
                <span className="ft-tag">{t.subject}</span>
                <span className="ft-tag">{t.level}</span>
              </div>

              <div className="ft-card__actions">
                <Link to={`/tutor/${t.id}`} className="ft-btn-outline">View Profile</Link>
                <Link to="/booking" className="ft-btn-primary">Book Session</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}