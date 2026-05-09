import { useEffect } from "react";

interface Props {
  user: any;
  onClose: () => void;
}

export default function UserModal({ user, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  const isTutor = user.role === "tutor";
  const estimatedEarnings = (user.price || 0) * (user.sessions || 0);

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white", borderRadius: 16, padding: "2rem",
          width: "100%", maxWidth: 520, boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          maxHeight: "90vh", overflowY: "auto"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: isTutor ? "var(--orange)" : "var(--purple)",
              color: "white", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "1.4rem", fontWeight: 700
            }}>
              {user.name[0]}
            </div>
            <div>
              <h2 style={{ margin: 0, color: "var(--dark)", fontSize: "1.2rem" }}>{user.name}</h2>
              <span style={{
                background: isTutor ? "#fff3ee" : "#ede9ff",
                color: isTutor ? "var(--orange)" : "var(--purple)",
                padding: "2px 10px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 600
              }}>{user.role}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f0f0f0", border: "none", borderRadius: "50%",
              width: 36, height: 36, cursor: "pointer", fontSize: "1rem"
            }}
          >✕</button>
        </div>

        {/* Basic Info */}
        <div style={{
          background: "#f9f9ff", borderRadius: 12, padding: "1rem",
          marginBottom: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem"
        }}>
          {[
            { icon: "📧", label: "Email", value: user.email },
            { icon: "📍", label: "City", value: user.city || "—" },
            { icon: "📱", label: "Phone", value: user.phone || "—" },
            { icon: "📅", label: "Joined", value: new Date(user.createdAt).toLocaleDateString() },
          ].map(item => (
            <div key={item.label}>
              <p style={{ fontSize: "0.75rem", color: "var(--gray)", margin: "0 0 2px" }}>
                {item.icon} {item.label}
              </p>
              <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--dark)", margin: 0 }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Status */}
        <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--gray)" }}>Status:</span>
          <span style={{
            padding: "3px 12px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 600,
            background: user.status === "Active" ? "#e6faf0" : "#fdecea",
            color: user.status === "Active" ? "#27ae60" : "#e74c3c"
          }}>{user.status}</span>
        </div>

        {/* Tutor specific */}
        {isTutor && (
          <>
            <div style={{
              background: "#f9f9ff", borderRadius: 12, padding: "1rem", marginBottom: "1rem"
            }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--dark)", marginBottom: "0.75rem" }}>
                📖 Teaching Info
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {[
                  { label: "Subject", value: user.subject || "—" },
                  { label: "Price/hr", value: `Rs ${user.price || 0}` },
                  { label: "Total Sessions", value: user.sessions || 0 },
                  { label: "Reviews", value: user.reviews || 0 },
                ].map(item => (
                  <div key={item.label}>
                    <p style={{ fontSize: "0.75rem", color: "var(--gray)", margin: "0 0 2px" }}>{item.label}</p>
                    <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--dark)", margin: 0 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Chart */}
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--dark)", marginBottom: "0.5rem" }}>
                ⭐ Rating
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--dark)" }}>{user.rating || 0}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
                    {[1,2,3,4,5].map(star => (
                      <div key={star} style={{
                        flex: 1, height: 8, borderRadius: 4,
                        background: star <= Math.round(user.rating || 0) ? "#f39c12" : "#e0e0e0"
                      }} />
                    ))}
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--gray)", margin: 0 }}>
                    out of 5.0
                  </p>
                </div>
              </div>
            </div>

            {/* Sessions Progress */}
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--dark)", marginBottom: "0.5rem" }}>
                📊 Sessions Progress
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--gray)", marginBottom: 4 }}>
                <span>{user.sessions || 0} sessions completed</span>
                <span>Target: 500</span>
              </div>
              <div style={{ height: 10, background: "#ebebf5", borderRadius: 10, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${Math.min(((user.sessions || 0) / 500) * 100, 100)}%`,
                  background: "var(--purple)", borderRadius: 10,
                  transition: "width 0.4s ease"
                }} />
              </div>
            </div>

            {/* Estimated Earnings */}
            <div style={{
              background: "#ede9ff", borderRadius: 12, padding: "1rem",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div>
                <p style={{ fontSize: "0.78rem", color: "var(--purple)", margin: "0 0 4px" }}>💰 Estimated Total Earnings</p>
                <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--dark)", margin: 0 }}>
                  Rs {estimatedEarnings.toLocaleString()}
                </p>
              </div>
              <div style={{ fontSize: "2rem" }}>💸</div>
            </div>
          </>
        )}

        {/* Student specific */}
        {!isTutor && (
          <div style={{
            background: "#f9f9ff", borderRadius: 12, padding: "1rem"
          }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--dark)", marginBottom: "0.75rem" }}>
              📚 Student Activity
            </p>
            {[
              { label: "Sessions Booked", value: 0, max: 50, color: "var(--purple)" },
              { label: "Courses Enrolled", value: 0, max: 10, color: "var(--orange)" },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--gray)", marginBottom: 4 }}>
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div style={{ height: 8, background: "#e0e0e0", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${(item.value / item.max) * 100}%`,
                    background: item.color, borderRadius: 10
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}