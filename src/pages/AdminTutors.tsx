import { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminLayout.css";
import { getUsers, updateUser } from "../api/api";
import UserModal from "../components/UserModal";

export default function AdminTutors() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);

  useEffect(() => {
    getUsers()
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

  const handleSuspend = async (tutor: any) => {
    const newStatus = tutor.status === "Active" ? "Suspended" : "Active";
    const updated = await updateUser(tutor._id, { status: newStatus });
    setTutors(prev => prev.map(t => t._id === tutor._id ? { ...t, status: updated.status } : t));
  };

  const filtered = tutors.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || t.status === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return <div style={{ padding: "2rem" }}>Loading tutors...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Tutors Management</h1>
            <p>Manage all registered tutors on the platform</p>
          </div>
          <button className="btn-primary">+ Add Tutor</button>
        </div>

        <div className="admin-filters">
          <input
            type="text"
            placeholder="🔍 Search tutors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <div className="filter-tabs">
            {["All", "Active", "Suspended", "Pending"].map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >{f}</button>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tutor</th><th>Subject</th><th>City</th>
                <th>Sessions</th><th>Rating</th><th>Price/hr</th>
                <th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t._id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar">{t.name[0]}</div>
                      {t.name}
                    </div>
                  </td>
                  <td>{t.subject || '—'}</td>
                  <td>{t.city || '—'}</td>
                  <td>{t.sessions || 0}</td>
                  <td>⭐ {t.rating || 0}</td>
                  <td style={{ color: "var(--orange)", fontWeight: 600 }}>
                    Rs {t.price || 0}
                  </td>
                  <td>
                    <span className={`badge badge-${t.status.toLowerCase()}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn-action view"
                        onClick={() => setSelectedTutor(t)}
                      >
                        View
                      </button>
                      <button
                        className="btn-action suspend"
                        onClick={() => handleSuspend(t)}
                      >
                        {t.status === "Active" ? "Suspend" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {selectedTutor && (
        <UserModal user={selectedTutor} onClose={() => setSelectedTutor(null)} />
      )}
    </div>
  );
}