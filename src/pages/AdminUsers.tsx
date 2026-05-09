import { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminLayout.css";
import "./AdminUsers.css";
import { getUsers, updateUser, deleteUser } from "../api/api";
import UserModal from "../components/UserModal";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    getUsers()
      .then((data: any[]) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSuspend = async (user: any) => {
    const newStatus = user.status === "Active" ? "Suspended" : "Active";
    const updated = await updateUser(user._id, { status: newStatus });
    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, status: updated.status } : u));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await deleteUser(id);
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" || u.role === filter || u.status === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return <div style={{ padding: "2rem" }}>Loading users...</div>;

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
            {["All", "student", "tutor", "Active", "Suspended", "Pending"].map((f) => (
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
                <th>City</th><th>Joined</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar">{u.name[0]}</div>
                      {u.name}
                    </div>
                  </td>
                  <td style={{ color: "var(--gray)" }}>{u.email}</td>
                  <td>
                    <span className={`role-badge role-${u.role}`}>{u.role}</span>
                  </td>
                  <td>{u.city || '—'}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-${u.status.toLowerCase()}`}>{u.status}</span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn-action view"
                        onClick={() => setSelectedUser(u)}
                      >
                        View
                      </button>
                      <button
                        className="btn-action suspend"
                        onClick={() => handleSuspend(u)}
                      >
                        {u.status === "Active" ? "Suspend" : "Activate"}
                      </button>
                      <button
                        className="btn-action edit"
                        onClick={() => handleDelete(u._id)}
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

      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}