import { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Link } from "react-router-dom";
import "./AdminLayout.css";
import "./AdminDashboard.css";
import { getUsers, getBookings, getCourses } from "../api/api";
import AdminCharts from "../components/AdminCharts";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUsers(), getBookings(), getCourses()])
      .then(([usersData, bookingsData, coursesData]) => {
        setUsers(usersData);
        setBookings(bookingsData);
        setCourses(coursesData);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalStudents = users.filter(u => u.role === "student").length;
  const totalTutors = users.filter(u => u.role === "tutor").length;
  const recentUsers = [...users].reverse().slice(0, 5);
  const recentBookings = [...bookings].reverse().slice(0, 4);

  const stats = [
    { label: "Total Users", value: users.length, icon: "👥", color: "purple" },
    { label: "Active Tutors", value: totalTutors, icon: "🎓", color: "orange" },
    { label: "Courses", value: courses.length, icon: "📚", color: "green" },
    { label: "Bookings", value: bookings.length, icon: "📅", color: "blue" },
  ];

  if (loading) return <div style={{ padding: "2rem" }}>Loading dashboard...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome back, Admin! Here's what's happening today.</p>
          </div>
          <div className="header-date">
            📅 {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className={`stat-card stat-${s.color}`}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
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
                <tr>
                  <th>Name</th><th>Role</th><th>City</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar">{u.name[0]}</div>
                        {u.name}
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge role-${u.role}`}>{u.role}</span>
                    </td>
                    <td>{u.city || '—'}</td>
                    <td>
                      <span className={`badge badge-${u.status.toLowerCase()}`}>{u.status}</span>
                    </td>
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
                <tr>
                  <th>Student</th><th>Tutor</th><th>Amount</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.student?.name}</td>
                    <td>{b.tutor?.name}</td>
                    <td style={{ fontWeight: 600, color: "var(--orange)" }}>
                      Rs {b.amount}
                    </td>
                    <td>
                      <span className={`badge badge-${b.status.toLowerCase()}`}>
                        {b.status}
                      </span>
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
              { to: "/dashboard/admin/users", icon: "👥", label: "Manage Users" },
              { to: "/dashboard/admin/courses", icon: "📚", label: "Review Courses" },
              { to: "/dashboard/admin/bookings", icon: "📅", label: "View Bookings" },
              { to: "/dashboard/admin/settings", icon: "⚙️", label: "Settings" },
            ].map((q) => (
              <Link key={q.to} to={q.to} className="quick-link-card">
                <span>{q.icon}</span>
                <span>{q.label}</span>
              </Link>
            ))}
          </div>
        </div>
        <AdminCharts
          bookings={bookings}
          users={users}
          courses={courses}
        />
      </main>
    </div>
  );
}