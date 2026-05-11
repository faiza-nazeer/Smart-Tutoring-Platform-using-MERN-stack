import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./FindTutors.css";

interface Tutor {
  _id: string;
  name: string;
  subject: string;
  city: string;
  status: string;
  role: string;
  rating?: number;
  sessions?: number;
  reviews?: number;
  price?: number;
}
const subjects = ["All", "Mathematics", "Physics", "English", "Chemistry", "Biology", "Computer Science", "Urdu", "Statistics"];
const cities = ["All", "Lahore", "Karachi", "Islamabad"];

export default function FindTutors() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [city, setCity] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then(res => res.json())
      .then((data: any[]) => {
        const onlyTutors = data.filter(u => u.role === "tutor");
        setTutors(onlyTutors);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = tutors.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject?.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subject === "All" || t.subject === subject;
    const matchCity = city === "All" || t.city === city;
    const matchAvailable = !onlyAvailable || t.status === "Active";
    return matchSearch && matchSubject && matchCity && matchAvailable;
  });

  if (loading) return <div style={{ padding: "2rem" }}>Loading tutors...</div>;

  return (
    <div className="ft-page">
      <div className="ft-header">
        <h1>Find a Tutor</h1>
        <p>Browse expert tutors and book your first session today</p>
      </div>

      <div className="ft-filters">
        <input
          className="ft-search"
          type="text"
          placeholder="🔍 Search by name or subject..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="ft-filter-row">
          <span>Subjects:</span>
          <select value={subject} onChange={e => setSubject(e.target.value)}>
            {subjects.map(s => <option key={s}>{s}</option>)}
          </select>
          <span>City:</span>
          <select value={city} onChange={e => setCity(e.target.value)}>
            {cities.map(c => <option key={c}>{c}</option>)}
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

      <div className="ft-grid">
        {filtered.length === 0 ? (
          <div className="ft-empty">No tutors found. Try adjusting your filters.</div>
        ) : (
          filtered.map(t => (
            <div className="ft-card" key={t._id}>
              <div className="ft-card__top">
                <div className="ft-card__avatar">
                  {t.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="ft-card__info">
                  <h3>{t.name}</h3>
                  <p>{t.subject} · {t.city}</p>
                  <span className={`ft-card__avail ${t.status === "Active" ? "avail-yes" : "avail-no"}`}>
                    {t.status === "Active" ? "● Available" : "● Unavailable"}
                  </span>
                </div>
              </div>

              <div className="ft-card__stats">
                <div className="ft-card__stat">
                  <strong>⭐ N/A</strong>
                  <span>Rating</span>
                </div>
                <div className="ft-card__stat">
                  <strong>0</strong>
                  <span>Sessions</span>
                </div>
                <div className="ft-card__stat">
                  <strong>Rs N/A</strong>
                  <span>per hour</span>
                </div>
              </div>

              <div className="ft-card__tags">
                <span className="ft-tag">{t.subject}</span>
              </div>

              <div className="ft-card__actions">
                <Link to={`/tutor/${t._id}`} className="ft-btn-outline">View Profile</Link>
                <Link to={`/booking?tutorId=${t._id}&tutorName=${encodeURIComponent(t.name)}&subject=${encodeURIComponent(t.subject)}&price=${t.price}`} className="ft-btn-primary">
                  Book Session
                </Link>            
                  </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}