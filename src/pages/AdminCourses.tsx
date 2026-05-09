import { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminLayout.css";
import "./AdminCourses.css";
import { getCourses } from "../api/api";
export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then((data: any[]) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this course permanently?")) return;
    await fetch(`http://localhost:5000/api/courses/${id}`, { method: "DELETE" });
    setCourses(prev => prev.filter(c => c._id !== id));
  };

  const handleStatusChange = async (id: string, status: string) => {
    const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    setCourses(prev => prev.map(c => c._id === id ? { ...c, status: updated.status } : c));
  };

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.tutor?.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || c.status === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return <div style={{ padding: "2rem" }}>Loading courses...</div>;

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
            {["All", "Published", "Draft"].map((f) => (
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
            <div key={course._id} className="course-card">
              <div className="course-card-header">
                <div className="course-icon">📘</div>
                <span className={`badge badge-${course.status.toLowerCase()}`}>
                  {course.status}
                </span>
              </div>
              <h3>{course.title}</h3>
              <p className="course-meta">👤 {course.tutor?.name}</p>
              <p className="course-meta">🏷️ {course.subject}</p>
              <div className="course-stats">
                <span>👨‍🎓 {course.studentsEnrolled}</span>
                <span>⭐ {course.rating}</span>
                <span className="course-price">Rs {course.price}</span>
              </div>
              <div className="action-btns" style={{ marginTop: 12 }}>
                {course.status !== "Published" && (
                  <button
                    className="btn-action edit"
                    onClick={() => handleStatusChange(course._id, "Published")}
                  >
                    Publish
                  </button>
                )}
                {course.status === "Published" && (
                  <button
                    className="btn-action view"
                    onClick={() => handleStatusChange(course._id, "Draft")}
                  >
                    Unpublish
                  </button>
                )}
                <button
                  className="btn-action suspend"
                  onClick={() => handleDelete(course._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}