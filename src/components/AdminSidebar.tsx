// src/components/AdminSidebar.tsx
import { Link, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

const navLinks = [
  { to: "/dashboard/admin", label: "Overview", icon: "📊" },
  { to: "/dashboard/admin/users", label: "Users", icon: "👥" },
  { to: "/dashboard/admin/tutors", label: "Tutors", icon: "🎓" },
  { to: "/dashboard/admin/courses", label: "Courses", icon: "📚" },
  { to: "/dashboard/admin/bookings", label: "Bookings", icon: "📅" },
  { to: "/dashboard/admin/earnings", label: "Earnings", icon: "💰" },
  { to: "/dashboard/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminSidebar() {
  const location = useLocation();
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">🎓</span>
        <span className="brand-name">eTutor <span>Admin</span></span>
      </div>
      <nav className="sidebar-nav">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`sidebar-link ${location.pathname === link.to ? "active" : ""}`}
          >
            <span>{link.icon}</span> {link.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <Link to="/" className="sidebar-link">🚪 Exit Admin</Link>
      </div>
    </aside>
  );
}