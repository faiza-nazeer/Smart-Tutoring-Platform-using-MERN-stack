import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminLayout.css";
import "./AdminEarnings.css";
import { getBookings, getUsers } from "../api/api";
import AdminCharts from "../components/AdminCharts";
export default function AdminEarnings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBookings(), getUsers()])
      .then(([bookingsData, usersData]) => {
        setBookings(bookingsData);
        setTutors(usersData.filter((u: any) => u.role === "tutor"));
        setLoading(false);
      })
      .catch((err: any) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const platformFee = Math.round(totalRevenue * 0.15);
  const tutorPayouts = totalRevenue - platformFee;
  const completedBookings = bookings.filter(b => b.status === "Completed");
  const pendingBookings = bookings.filter(b => b.status === "Pending");

  const kpis = [
    { label: "Total Revenue", value: `Rs ${totalRevenue.toLocaleString()}`, icon: "💰", color: "purple" },
    { label: "Tutor Payouts", value: `Rs ${tutorPayouts.toLocaleString()}`, icon: "💸", color: "orange" },
    { label: "Platform Revenue", value: `Rs ${platformFee.toLocaleString()}`, icon: "📈", color: "green" },
    { label: "Total Transactions", value: bookings.length, icon: "🔄", color: "blue" },
  ];

  const recentTransactions = [...bookings].reverse().slice(0, 5);

  if (loading) return <div style={{ padding: "2rem" }}>Loading earnings...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Earnings & Revenue</h1>
            <p>Platform financial overview and payouts</p>
          </div>
          <button className="btn-primary">📥 Export Report</button>
        </div>

        <div className="kpi-grid">
          {kpis.map((k) => (
            <div key={k.label} className={`kpi-card kpi-${k.color}`}>
              <div className="kpi-icon">{k.icon}</div>
              <div>
                <div className="kpi-value">{k.value}</div>
                <div className="kpi-label">{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="earnings-grid">
          <div className="admin-card chart-card">
            <h3>Booking Status Overview</h3>
            <div style={{ padding: "1rem 0" }}>
              {[
                { label: "Completed", count: completedBookings.length, color: "#27ae60" },
                { label: "Pending", count: pendingBookings.length, color: "var(--orange)" },
                { label: "Confirmed", count: bookings.filter(b => b.status === "Confirmed").length, color: "var(--purple)" },
                { label: "Cancelled", count: bookings.filter(b => b.status === "Cancelled").length, color: "#e74c3c" },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.88rem" }}>
                    <span>{item.label}</span>
                    <span style={{ fontWeight: 600 }}>{item.count}</span>
                  </div>
                  <div style={{ height: 8, background: "#ebebf5", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: bookings.length ? `${(item.count / bookings.length) * 100}%` : "0%",
                      background: item.color,
                      borderRadius: 10
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card" style={{ padding: 20 }}>
            <h3>Top Earning Tutors</h3>
            <div className="top-tutors">
              {tutors.slice(0, 5).map((t, i) => (
                <div key={t._id} className="tutor-earn-row">
                  <div className="earn-rank">{i + 1}</div>
                  <div className="avatar">{t.name[0]}</div>
                  <div className="earn-info">
                    <div className="earn-name">{t.name}</div>
                    <div className="earn-sub">{t.subject} · {t.sessions} sessions</div>
                  </div>
                  <div className="earn-amount">Rs {t.price * (t.sessions || 0)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ marginTop: 20, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>Recent Transactions</h3>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th><th>Tutor</th><th>Subject</th>
                <th>Total</th><th>Platform Fee</th><th>Tutor Gets</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((b) => (
                <tr key={b._id}>
                  <td>{b.student?.name}</td>
                  <td>{b.tutor?.name}</td>
                  <td>{b.subject}</td>
                  <td style={{ fontWeight: 600 }}>Rs {b.amount}</td>
                  <td style={{ color: "var(--orange)" }}>Rs {Math.round(b.amount * 0.15)}</td>
                  <td style={{ color: "#2e7d32", fontWeight: 600 }}>Rs {Math.round(b.amount * 0.85)}</td>
                  <td>
                    <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>s
          </table>
        </div>
        <AdminCharts
          bookings={bookings}
          users={tutors}
          courses={[]}
        />
      </main>
    </div>
  );
}