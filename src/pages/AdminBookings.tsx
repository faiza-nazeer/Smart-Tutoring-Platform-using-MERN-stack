// src/pages/AdminBookings.tsx
import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminLayout.css";
import "./AdminBookings.css";

const bookings = [
  { id: "#B001", student: "Alice Brown", tutor: "Dr. Sarah Johnson", subject: "Calculus", date: "May 10, 2026", time: "10:00 AM", duration: "1 hr", amount: "$49", status: "Confirmed" },
  { id: "#B002", student: "Bob Smith", tutor: "Prof. Michael Chen", subject: "Physics", date: "May 11, 2026", time: "2:00 PM", duration: "1.5 hr", amount: "$74", status: "Pending" },
  { id: "#B003", student: "Carol Davis", tutor: "Emma Williams", subject: "English", date: "May 12, 2026", time: "4:00 PM", duration: "1 hr", amount: "$39", status: "Completed" },
  { id: "#B004", student: "David Lee", tutor: "James Rodriguez", subject: "Chemistry", date: "May 13, 2026", time: "11:00 AM", duration: "2 hr", amount: "$108", status: "Cancelled" },
  { id: "#B005", student: "Eva Martinez", tutor: "Aisha Patel", subject: "Biology", date: "May 14, 2026", time: "9:00 AM", duration: "1 hr", amount: "$44", status: "Confirmed" },
  { id: "#B006", student: "Frank Wilson", tutor: "Tom Baker", subject: "Python", date: "May 15, 2026", time: "3:00 PM", duration: "1 hr", amount: "$29", status: "Pending" },
];

const statusClass: Record<string, string> = {
  Confirmed: "badge-active",
  Pending: "badge-pending",
  Completed: "badge-completed",
  Cancelled: "badge-suspended",
};

export default function AdminBookings() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.student.toLowerCase().includes(search.toLowerCase()) ||
      b.tutor.toLowerCase().includes(search.toLowerCase()) ||
      b.subject.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || b.status === filter;
    return matchSearch && matchFilter;
  });

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
            <div className="mini-stat"><span>142</span>Total</div>
            <div className="mini-stat green"><span>89</span>Confirmed</div>
            <div className="mini-stat orange"><span>24</span>Pending</div>
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
                <th>ID</th><th>Student</th><th>Tutor</th><th>Subject</th>
                <th>Date & Time</th><th>Duration</th><th>Amount</th>
                <th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td><code className="booking-id">{b.id}</code></td>
                  <td>
                    <div className="user-cell">
                      <div className="avatar">{b.student[0]}</div>
                      {b.student}
                    </div>
                  </td>
                  <td>{b.tutor}</td>
                  <td>{b.subject}</td>
                  <td>
                    <div>{b.date}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--light-gray)" }}>{b.time}</div>
                  </td>
                  <td>{b.duration}</td>
                  <td style={{ fontWeight: 600, color: "var(--orange)" }}>{b.amount}</td>
                  <td>
                    <span className={`badge ${statusClass[b.status]}`}>{b.status}</span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-action view">View</button>
                      <button className="btn-action suspend">Cancel</button>
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