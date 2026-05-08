// src/pages/AdminEarnings.tsx
import AdminSidebar from "../components/AdminSidebar";
import "./AdminLayout.css";
import "./AdminEarnings.css";

const kpis = [
  { label: "Total Revenue", value: "$52,300", icon: "💰", trend: "+18%", color: "purple" },
  { label: "Tutor Payouts", value: "$39,225", icon: "💸", trend: "+15%", color: "orange" },
  { label: "Net Platform Revenue", value: "$13,075", icon: "📈", trend: "+22%", color: "green" },
  { label: "Total Transactions", value: "574", icon: "🔄", trend: "+9%", color: "blue" },
];

const monthlyData = [
  { month: "Jan", revenue: 8400, payouts: 6300 },
  { month: "Feb", revenue: 9200, payouts: 6900 },
  { month: "Mar", revenue: 11000, payouts: 8250 },
  { month: "Apr", revenue: 10500, payouts: 7875 },
  { month: "May", revenue: 13200, payouts: 9900 },
];

const topTutors = [
  { name: "Dr. Sarah Johnson", subject: "Math", earnings: "$3,240", sessions: 68 },
  { name: "Aisha Patel", subject: "Biology", earnings: "$2,420", sessions: 55 },
  { name: "Prof. Michael Chen", subject: "Physics", earnings: "$2,180", sessions: 49 },
  { name: "Tom Baker", subject: "CS", earnings: "$1,940", sessions: 67 },
  { name: "Emma Williams", subject: "English", earnings: "$1,650", sessions: 42 },
];

const transactions = [
  { id: "#T001", student: "Alice Brown", tutor: "Dr. Sarah Johnson", amount: "$49", fee: "$7", payout: "$42", date: "May 8" },
  { id: "#T002", student: "Bob Smith", tutor: "Prof. Michael Chen", amount: "$74", fee: "$11", payout: "$63", date: "May 8" },
  { id: "#T003", student: "Eva Martinez", tutor: "Aisha Patel", amount: "$44", fee: "$7", payout: "$37", date: "May 7" },
  { id: "#T004", student: "Frank Wilson", tutor: "Tom Baker", amount: "$29", fee: "$4", payout: "$25", date: "May 7" },
];

const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

export default function AdminEarnings() {
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
              <div className="kpi-trend">{k.trend}</div>
            </div>
          ))}
        </div>

        <div className="earnings-grid">
          <div className="admin-card chart-card">
            <h3>Monthly Revenue</h3>
            <div className="bar-chart">
              {monthlyData.map((d) => (
                <div key={d.month} className="bar-group">
                  <div className="bars">
                    <div className="bar bar-revenue" style={{ height: `${(d.revenue / maxRevenue) * 160}px` }} title={`$${d.revenue}`} />
                    <div className="bar bar-payout" style={{ height: `${(d.payouts / maxRevenue) * 160}px` }} title={`$${d.payouts}`} />
                  </div>
                  <div className="bar-label">{d.month}</div>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <span className="legend-item purple">■ Revenue</span>
              <span className="legend-item orange">■ Payouts</span>
            </div>
          </div>

          <div className="admin-card" style={{ padding: 20 }}>
            <h3>Top Earning Tutors</h3>
            <div className="top-tutors">
              {topTutors.map((t, i) => (
                <div key={t.name} className="tutor-earn-row">
                  <div className="earn-rank">{i + 1}</div>
                  <div className="avatar">{t.name[0]}</div>
                  <div className="earn-info">
                    <div className="earn-name">{t.name}</div>
                    <div className="earn-sub">{t.subject} · {t.sessions} sessions</div>
                  </div>
                  <div className="earn-amount">{t.earnings}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ marginTop: 20, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>Recent Transactions</h3>
            <button className="btn-secondary">View All</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Student</th><th>Tutor</th><th>Total</th><th>Platform Fee</th><th>Tutor Gets</th><th>Date</th></tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td><code className="booking-id">{t.id}</code></td>
                  <td>{t.student}</td>
                  <td>{t.tutor}</td>
                  <td style={{ fontWeight: 600 }}>{t.amount}</td>
                  <td style={{ color: "var(--orange)" }}>{t.fee}</td>
                  <td style={{ color: "#2e7d32", fontWeight: 600 }}>{t.payout}</td>
                  <td style={{ color: "var(--light-gray)" }}>{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}