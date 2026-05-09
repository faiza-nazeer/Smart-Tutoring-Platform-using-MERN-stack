import { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminLayout.css";
import "./AdminBookings.css";
import { getBookings, updateBooking, deleteBooking } from "../api/api";

const statusClass: Record<string, string> = {
  Confirmed: "badge-active",
  Pending: "badge-pending",
  Completed: "badge-completed",
  Cancelled: "badge-suspended",
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookings()
      .then((data: any[]) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm("Cancel this booking?")) return;
    const updated = await updateBooking(id, { status: "Cancelled" });
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status: updated.status } : b));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    await deleteBooking(id);
    setBookings(prev => prev.filter(b => b._id !== id));
  };

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.tutor?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.subject?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || b.status === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return <div style={{ padding: "2rem" }}>Loading bookings...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Bookings Management</h1>
            <p>Track and manage all session bookings</p>
          </div>
          <div className="booking-kpis">
            <div className="mini-stat">
              <span>{bookings.length}</span>Total
            </div>
            <div className="mini-stat green">
              <span>{bookings.filter(b => b.status === "Confirmed").length}</span>Confirmed
            </div>
            <div className="mini-stat orange">
              <span>{bookings.filter(b => b.status === "Pending").length}</span>Pending
            </div>
          </div>
        </div>

        <div className="admin-filters">
          <input
            type="text"
            placeholder="🔍 Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <div className="filter-tabs">
            {["All", "Confirmed", "Pending", "Completed", "Cancelled"].map((f) => (
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
                <th>Student</th><th>Tutor</th><th>Subject</th>
                <th>Date & Time</th><th>Duration</th><th>Amount</th>
                <th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar">{b.student?.name?.[0]}</div>
                      {b.student?.name}
                    </div>
                  </td>
                  <td>{b.tutor?.name}</td>
                  <td>{b.subject}</td>
                  <td>
                    <div>{b.date}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--light-gray)" }}>{b.time}</div>
                  </td>
                  <td>{b.duration}</td>
                  <td style={{ fontWeight: 600, color: "var(--orange)" }}>Rs {b.amount}</td>
                  <td>
                    <span className={`badge ${statusClass[b.status] || "badge-pending"}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn-action view"
                        onClick={() => handleCancel(b._id)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-action suspend"
                        onClick={() => handleDelete(b._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}