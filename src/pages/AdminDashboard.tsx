// src/pages/AdminDashboard.tsx
import AdminSidebar from "../components/AdminSidebar";
import { Link } from "react-router-dom";
import "./AdminLayout.css";
import "./AdminDashboard.css";

const stats = [
  { label: "Total Users", value: "3,482", icon: "👥", trend: "+12%", color: "purple" },
  { label: "Active Tutors", value: "186", icon: "🎓", trend: "+5%", color: "orange" },
  { label: "Courses", value: "94", icon: "📚", trend: "+8%", color: "green" },
  { label: "Revenue", value: "$52,300", icon: "💰", trend: "+18%", color: "blue" },
];

const recentUsers = [
  { name: "Alice Brown", role: "Student", joined: "May 8", status: "Active" },
  { name: "Tom Baker", role: "Tutor", joined: "May 7", status: "Pending" },
  { name: "Carol Davis", role: "Student", joined: "May 7", status: "Active" },
  { name: "James Rodriguez", role: "Tutor", joined: "May 6", status: "Suspended" },
  { name: "Eva Martinez", role: "Student", joined: "May 6", status: "Active" },
];

const recentBookings = [
  { id: "#B041", student: "Alice Brown", tutor: "Dr. Sarah Johnson", amount: "$49", status: "Confirmed" },
  { id: "#B040", student: "Bob Smith", tutor: "Prof. Michael Chen", amount: "$74", status: "Pending" },
  { id: "#B039", student: "Eva Martinez", tutor: "Aisha Patel", amount: "$44", status: "Completed" },
  { id: "#B038", student: "Frank Wilson", tutor: "Tom Baker", amount: "$29", status: "Cancelled" },
];

export default function AdminDashboard() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome back, Admin! Here's what's happening today.</p>
          </div>
          <div className="header-date">📅 May 8, 2026</div>
        </div>

        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className={`stat-card stat-${s.color}`}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
              <div className="stat-trend">{s.trend}</div>
            </div>
          ))}
        </div>

        <div className="dashboard-grid">
          <div className="admin-card dash-card">
            <div className="card-header">
              <h3>Recent Users</h3>
              <Link to="/dashboard/admin/users" className="view-all">View All →</Link>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Role</th><th>Joined</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u.name}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar">{u.name[0]}</div>
                        {u.name}
                      </div>
                    </td>
                    <td><span className={`role-badge role-${u.role.toLowerCase()}`}>{u.role}</span></td>
                    <td>{u.joined}</td>
                    <td><span className={`badge badge-${u.status.toLowerCase()}`}>{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-card dash-card">
            <div className="card-header">
              <h3>Recent Bookings</h3>
              <Link to="/dashboard/admin/bookings" className="view-all">View All →</Link>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>ID</th><th>Student</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td><code className="booking-id">{b.id}</code></td>
                    <td>{b.student}</td>
                    <td style={{ fontWeight: 600, color: "var(--orange)" }}>{b.amount}</td>
                    <td>
                      <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="quick-links">
          <h3>Quick Actions</h3>
          <div className="quick-links-grid">
            {[
              { to: "/dashboard/admin/tutors", icon: "🎓", label: "Manage Tutors" },
              { to: "/dashboard/admin/courses", icon: "📚", label: "Review Courses" },
              { to: "/dashboard/admin/earnings", icon: "💰", label: "View Earnings" },
              { to: "/dashboard/admin/settings", icon: "⚙️", label: "Settings" },
            ].map((q) => (
              <Link key={q.to} to={q.to} className="quick-link-card">
                <span>{q.icon}</span>
                <span>{q.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}