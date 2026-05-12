import { useState } from "react";
import "./MyProfile.css";
import { useAuth } from "../context/AuthContext";

export default function MyProfile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    bio: user?.bio || '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`http://localhost:5000/api/users/${user?._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSuccess(true);
      setEditing(false);
      updateUser(form);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  return (
    <div className="my-profile-page">
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your personal information</p>
        </div>
        <button
          className={`edit-btn ${editing ? "save" : ""}`}
          onClick={() => {
            if (editing) handleSave();
            else setEditing(true);
          }}
        >
          {saving ? 'Saving...' : editing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {success && (
        <div style={{
          background: '#e6faf0', color: '#27ae60',
          padding: '0.75rem 1rem', borderRadius: 8,
          marginBottom: '1rem', fontWeight: 600
        }}>
          ✅ Profile updated successfully!
        </div>
      )}

      <div className="profile-layout">
        <div className="profile-sidebar">
          <div className="avatar-circle">
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <h3>{form.name}</h3>
          <span className="role-badge">
            {user?.role === 'tutor' ? 'Tutor' : 'Student'}
          </span>
          <p className="profile-email">{form.email}</p>

          <div className="profile-stats-mini">
            <div>
              <strong>{user?.sessions || 0}</strong>
              <span>Sessions</span>
            </div>
            <div>
              <strong>{user?.rating || 0}</strong>
              <span>Rating</span>
            </div>
            <div>
              <strong>{user?.reviews || 0}</strong>
              <span>Reviews</span>
            </div>
          </div>
        </div>

        <div className="profile-form-area">
          <div className="form-section">
            <h2>Personal Information</h2>
            <div className="form-grid">
              {[
                { label: "Full Name", name: "name" },
                { label: "Email Address", name: "email" },
                { label: "Phone Number", name: "phone" },
                { label: "City", name: "city" },
              ].map(field => (
                <div className="form-group" key={field.name}>
                  <label>{field.label}</label>
                  <input
                    type="text"
                    name={field.name}
                    value={form[field.name as keyof typeof form]}
                    onChange={handleChange}
                    disabled={!editing}
                    className={editing ? "active" : ""}
                  />
                </div>
              ))}
            </div>

            <div className="form-group full-width">
              <label>Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                disabled={!editing}
                className={editing ? "active" : ""}
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Account Info</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={user?.role || ''}
                  disabled
                  style={{ textTransform: 'capitalize' }}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <input
                  type="text"
                  value={user?.status || 'Active'}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}