// src/pages/AdminTutors.tsx
import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminLayout.css";

const tutors = [
  { id: 1, name: "Dr. Sarah Johnson", subject: "Mathematics", students: 142, rating: 4.9, earnings: "$3,240", status: "Active", joined: "Jan 2024" },
  { id: 2, name: "Prof. Michael Chen", subject: "Physics", students: 98, rating: 4.8, earnings: "$2,180", status: "Active", joined: "Feb 2024" },
  { id: 3, name: "Emma Williams", subject: "English Literature", students: 75, rating: 4.7, earnings: "$1,650", status: "Active", joined: "Mar 2024" },
  { id: 4, name: "James Rodriguez", subject: "Chemistry", students: 60, rating: 4.6, earnings: "$1,320", status: "Suspended", joined: "Apr 2024" },
  { id: 5, name: "Aisha Patel", subject: "Biology", students: 110, rating: 4.9, earnings: "$2,420", status: "Active", joined: "Jan 2024" },
  { id: 6, name: "Tom Baker", subject: "Computer Science", students: 88, rating: 4.5, earnings: "$1,940", status: "Pending", joined: "May 2024" },
];

export default function AdminTutors() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = tutors.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || t.status === filter;
    return matchSearch && matchFilter;
  });

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
                <th>Tutor</th><th>Subject</th><th>Students</th>
                <th>Rating</th><th>Earnings</th><th>Joined</th>
                <th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar">{t.name[0]}</div>
                      {t.name}
                    </div>
                  </td>
                  <td>{t.subject}</td>
                  <td>{t.students}</td>
                  <td>⭐ {t.rating}</td>
                  <td style={{ fontWeight: 600, color: "var(--orange)" }}>{t.earnings}</td>
                  <td>{t.joined}</td>
                  <td>
                    <span className={`badge badge-${t.status.toLowerCase()}`}>{t.status}</span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-action view">View</button>
                      <button className="btn-action suspend">
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
    </div>
  );
}
