// src/pages/AdminSettings.tsx
import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminLayout.css";
import "./AdminSettings.css";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const [general, setGeneral] = useState({
    siteName: "eTutor",
    siteEmail: "admin@etutor.com",
    supportEmail: "support@etutor.com",
    timezone: "UTC+0",
    currency: "USD",
    language: "English",
  });

  const [fees, setFees] = useState({
    platformFee: "15",
    minSession: "30",
    maxSession: "120",
    minWithdrawal: "50",
  });

  const [notifications, setNotifications] = useState({
    emailNewUser: true,
    emailNewBooking: true,
    emailPayment: true,
    emailDispute: false,
    smsBooking: false,
    smsPayment: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { id: "general", label: "⚙️ General" },
    { id: "fees", label: "💰 Fees & Limits" },
    { id: "notifications", label: "🔔 Notifications" },
    { id: "security", label: "🔒 Security" },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Platform Settings</h1>
            <p>Configure global platform settings and preferences</p>
          </div>
          {saved && <div className="save-toast">✅ Settings saved successfully!</div>}
        </div>

        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >{tab.label}</button>
          ))}
        </div>

        {activeTab === "general" && (
          <div className="settings-section">
            <div className="settings-grid">
              {Object.entries(general).map(([key, value]) => (
                <div key={key} className="settings-field">
                  <label>{key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</label>
                  {["timezone", "currency", "language"].includes(key) ? (
                    <select value={value} onChange={(e) => setGeneral({ ...general, [key]: e.target.value })}>
                      {key === "timezone" && ["UTC-5", "UTC+0", "UTC+1", "UTC+5"].map((o) => <option key={o}>{o}</option>)}
                      {key === "currency" && ["USD", "EUR", "GBP", "PKR"].map((o) => <option key={o}>{o}</option>)}
                      {key === "language" && ["English", "French", "Spanish", "Urdu"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={value} onChange={(e) => setGeneral({ ...general, [key]: e.target.value })} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "fees" && (
          <div className="settings-section">
            <div className="settings-grid">
              <div className="settings-field">
                <label>Platform Fee</label>
                <div className="input-group">
                  <input type="number" value={fees.platformFee} onChange={(e) => setFees({ ...fees, platformFee: e.target.value })} />
                  <span className="input-affix">%</span>
                </div>
                <p className="field-hint">Percentage taken from each transaction</p>
              </div>
              <div className="settings-field">
                <label>Min Session Duration</label>
                <div className="input-group">
                  <input type="number" value={fees.minSession} onChange={(e) => setFees({ ...fees, minSession: e.target.value })} />
                  <span className="input-affix">min</span>
                </div>
              </div>
              <div className="settings-field">
                <label>Max Session Duration</label>
                <div className="input-group">
                  <input type="number" value={fees.maxSession} onChange={(e) => setFees({ ...fees, maxSession: e.target.value })} />
                  <span className="input-affix">min</span>
                </div>
              </div>
              <div className="settings-field">
                <label>Min Withdrawal</label>
                <div className="input-group">
                  <span className="input-affix">$</span>
                  <input type="number" value={fees.minWithdrawal} onChange={(e) => setFees({ ...fees, minWithdrawal: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="settings-section">
            {[
              { group: "Email Notifications", prefix: "email" },
              { group: "SMS Notifications", prefix: "sms" },
            ].map(({ group, prefix }) => (
              <div key={group} className="notif-group">
                <h4>{group}</h4>
                {Object.entries(notifications)
                  .filter(([k]) => k.startsWith(prefix))
                  .map(([key, value]) => (
                    <div key={key} className="toggle-row">
                      <div>
                        <div className="toggle-label">
                          {key.replace(prefix, "").replace(/([A-Z])/g, " $1").trim()}
                        </div>
                        <div className="toggle-desc">Receive {prefix} when this event occurs</div>
                      </div>
                      <button
                        className={`toggle-btn ${value ? "on" : ""}`}
                        onClick={() => setNotifications({ ...notifications, [key]: !value })}
                      >
                        <span className="toggle-knob" />
                      </button>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === "security" && (
          <div className="settings-section">
            <div className="security-grid">
              <div className="security-card">
                <div className="security-icon">🔑</div>
                <h4>Change Admin Password</h4>
                <p>Update your admin account password</p>
                {["Current Password", "New Password", "Confirm Password"].map((label) => (
                  <div key={label} className="settings-field" style={{ marginBottom: 12 }}>
                    <label>{label}</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                ))}
                <button className="btn-primary" style={{ marginTop: 8 }}>Update Password</button>
              </div>
              <div className="security-card">
                <div className="security-icon">🛡️</div>
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security to your admin account</p>
                <div className="toggle-row">
                  <span className="toggle-label">Enable 2FA</span>
                  <button className="toggle-btn"><span className="toggle-knob" /></button>
                </div>
                <div className="tfa-info">
                  📱 Scan a QR code with your authenticator app to enable 2FA on your account.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="settings-actions">
          <button className="btn-outline">Reset to Defaults</button>
          <button className="btn-primary" onClick={handleSave}>💾 Save Changes</button>
        </div>
      </main>
    </div>
  );
}