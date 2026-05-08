// src/pages/AdminCourses.tsx
import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminLayout.css";
import "./AdminCourses.css";

const courses = [
  { id: 1, title: "Advanced Calculus", tutor: "Dr. Sarah Johnson", category: "Mathematics", students: 89, price: "$49", rating: 4.9, status: "Published" },
  { id: 2, title: "Quantum Physics Basics", tutor: "Prof. Michael Chen", category: "Physics", students: 56, price: "$59", rating: 4.8, status: "Published" },
  { id: 3, title: "Shakespeare & Beyond", tutor: "Emma Williams", category: "English", students: 44, price: "$39", rating: 4.7, status: "Published" },
  { id: 4, title: "Organic Chemistry", tutor: "James Rodriguez", category: "Chemistry", students: 33, price: "$54", rating: 4.5, status: "Draft" },
  { id: 5, title: "Cell Biology", tutor: "Aisha Patel", category: "Biology", students: 71, price: "$44", rating: 4.9, status: "Published" },
  { id: 6, title: "Python for Beginners", tutor: "Tom Baker", category: "Computer Science", students: 120, price: "$29", rating: 4.6, status: "Review" },
];

export default function AdminCourses() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.tutor.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || c.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Courses Management</h1>
            <p>Review, publish, and manage all platform courses</p>
          </div>
          <button className="btn-primary">+ Add Course</button>
        </div>

        <div className="admin-filters">
          <input
            type="text"
            placeholder="🔍 Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <div className="filter-tabs">
            {["All", "Published", "Draft", "Review"].map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >{f}</button>
            ))}
          </div>
        </div>

        <div className="courses-grid">
          {filtered.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-card-header">
                <div className="course-icon">📘</div>
                <span className={`badge badge-${course.status.toLowerCase()}`}>{course.status}</span>
              </div>
              <h3>{course.title}</h3>
              <p className="course-meta">👤 {course.tutor}</p>
              <p className="course-meta">🏷️ {course.category}</p>
              <div className="course-stats">
                <span>👨‍🎓 {course.students}</span>
                <span>⭐ {course.rating}</span>
                <span className="course-price">{course.price}</span>
              </div>
              <div className="action-btns" style={{ marginTop: 12 }}>
                <button className="btn-action view">View</button>
                <button className="btn-action edit">Edit</button>
                <button className="btn-action suspend">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}