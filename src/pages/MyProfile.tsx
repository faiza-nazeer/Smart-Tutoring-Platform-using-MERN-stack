import { useState } from "react";
import "./MyProfile.css";

export default function MyProfile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "Ahmed Khan",
    email: "ahmed@email.com",
    phone: "+92 300 1234567",
    city: "Lahore",
    grade: "Grade 11",
    bio: "A passionate learner focused on STEM subjects.",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="my-profile-page">
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your personal information</p>
        </div>
        <button className={`edit-btn ${editing ? "save" : ""}`} onClick={() => setEditing(!editing)}>
          {editing ? "✓ Save Changes" : "✎ Edit Profile"}
        </button>
      </div>

      <div className="profile-layout">
        <div className="profile-sidebar">
          <div className="avatar-circle">AK</div>
          <h3>{form.name}</h3>
          <span className="role-badge">Student</span>
          <p className="profile-email">{form.email}</p>

          <div className="profile-stats-mini">
            <div><strong>12</strong><span>Sessions</span></div>
            <div><strong>3</strong><span>Courses</span></div>
            <div><strong>4.8</strong><span>Rating</span></div>
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
                { label: "Grade / Level", name: "grade" },
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
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Subjects of Interest</h2>
            <div className="subjects-list">
              {["Mathematics", "Physics", "English"].map(s => (
                <span key={s} className="subject-tag">{s}</span>
              ))}
              {editing && <button className="add-subject-btn">+ Add</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}