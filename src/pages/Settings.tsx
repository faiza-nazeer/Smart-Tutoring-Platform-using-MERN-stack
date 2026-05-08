import { useState } from "react";
import "./Settings.css";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    sessionReminders: true,
    newMessages: true,
    promotions: false,
    weeklyReport: true,
  });

  const toggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account preferences</p>
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-card">
          <h2>🔔 Notifications</h2>
          <div className="toggle-list">
            {[
              { key: "sessionReminders", label: "Session Reminders", desc: "Get reminded before your sessions" },
              { key: "newMessages", label: "New Messages", desc: "Notify when a tutor messages you" },
              { key: "promotions", label: "Promotions & Offers", desc: "Special deals and discounts" },
              { key: "weeklyReport", label: "Weekly Progress Report", desc: "Summary of your learning activity" },
            ].map(item => (
              <div className="toggle-row" key={item.key}>
                <div>
                  <p className="toggle-label">{item.label}</p>
                  <p className="toggle-desc">{item.desc}</p>
                </div>
                <button
                  className={`toggle-switch ${notifications[item.key as keyof typeof notifications] ? "on" : ""}`}
                  onClick={() => toggle(item.key as keyof typeof notifications)}
                >
                  <span className="toggle-knob" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-card">
          <h2>🔒 Security</h2>
          <div className="settings-field">
            <label>Current Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <div className="settings-field">
            <label>New Password</label>
            <input type="password" placeholder="Enter new password" />
          </div>
          <div className="settings-field">
            <label>Confirm New Password</label>
            <input type="password" placeholder="Confirm new password" />
          </div>
          <button className="save-btn">Update Password</button>
        </div>

        <div className="settings-card">
          <h2>🌐 Preferences</h2>
          <div className="settings-field">
            <label>Language</label>
            <select>
              <option>English</option>
              <option>Urdu</option>
            </select>
          </div>
          <div className="settings-field">
            <label>Timezone</label>
            <select>
              <option>Asia/Karachi (PKT, UTC+5)</option>
              <option>UTC</option>
            </select>
          </div>
          <button className="save-btn">Save Preferences</button>
        </div>

        <div className="settings-card danger-zone">
          <h2>⚠️ Danger Zone</h2>
          <p>These actions are permanent and cannot be undone.</p>
          <div className="danger-actions">
            <button className="danger-btn-outline">Deactivate Account</button>
            <button className="danger-btn">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}