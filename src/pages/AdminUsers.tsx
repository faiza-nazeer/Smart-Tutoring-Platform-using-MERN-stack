// src/pages/AdminUsers.tsx
import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminLayout.css";
import "./AdminUsers.css";

const users = [
  { id: 1, name: "Alice Brown", email: "alice@email.com", role: "Student", joined: "Jan 2024", status: "Active", courses: 4 },
  { id: 2, name: "Tom Baker", email: "tom@email.com", role: "Tutor", joined: "Feb 2024", status: "Pending", courses: 3 },
  { id: 3, name: "Carol Davis", email: "carol@email.com", role: "Student", joined: "Mar 2024", status: "Active", courses: 2 },
  { id: 4, name: "James Rodriguez", email: "james@email.com", role: "Tutor", joined: "Apr 2024", status: "Suspended", courses: 1 },
  { id: 5, name: "Eva Martinez", email: "eva@email.com", role: "Student", joined: "Jan 2024", status: "Active", courses: 6 },
  { id: 6, name: "Frank Wilson", email: "frank@email.com", role: "Student", joined: "May 2024", status: "Active", courses: 1 },
  { id: 7, name: "Dr. Sarah Johnson", email: "sarah@email.com", role: "Tutor", joined: "Jan 2024", status: "Active", courses: 5 },
  { id: 8, name: "Bob Smith", email: "bob@email.com", role: "Student", joined: "Mar 2024", status: "Active", courses: 3 },
];

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" || u.role === filter || u.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Users Management</h1>
            <p>Manage all students and tutors on the platform</p>
          </div>
          <button className="btn-primary">+ Add User</button>
        </div>

        <div className="admin-filters">
          <input
            type="text"
            placeholder="🔍 Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <div className="filter-tabs">
            {["All", "Student", "Tutor", "Active", "Suspended", "Pending"].map((f) => (
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
                <th>User</th><th>Email</th><th>Role</th>
                <th>Courses</th><th>Joined</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar">{u.name[0]}</div>
                      {u.name}
                    </div>
                  </td>
                  <td style={{ color: "var(--gray)" }}>{u.email}</td>
                  <td>
                    <span className={`role-badge role-${u.role.toLowerCase()}`}>{u.role}</span>
                  </td>
                  <td>{u.courses}</td>
                  <td>{u.joined}</td>
                  <td>
                    <span className={`badge badge-${u.status.toLowerCase()}`}>{u.status}</span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-action view">View</button>
                      <button className="btn-action edit">Edit</button>
                      <button className="btn-action suspend">
                        {u.status === "Active" ? "Suspend" : "Activate"}
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