import "./TutorEarnings.css";

const monthly = [
  { month: "Jan", amount: 55000, sessions: 32 },
  { month: "Feb", amount: 62000, sessions: 38 },
  { month: "Mar", amount: 58000, sessions: 35 },
  { month: "Apr", amount: 72000, sessions: 44 },
];

const transactions = [
  { id: 1, student: "Ahmed Khan", course: "Master Mathematics", date: "Today", amount: 1500, avatar: "AK" },
  { id: 2, student: "Fatima Tariq", course: "Advanced Algebra", date: "Yesterday", amount: 1500, avatar: "FT" },
  { id: 3, student: "Hassan Ali", course: "Calculus Fundamentals", date: "Mon, 22 Apr", amount: 1500, avatar: "HA" },
  { id: 4, student: "Zara Imran", course: "Master Mathematics", date: "Sat, 20 Apr", amount: 1500, avatar: "ZI" },
  { id: 5, student: "Nadia Iqbal", course: "Calculus Fundamentals", date: "Fri, 19 Apr", amount: 1500, avatar: "NI" },
];

const maxAmount = Math.max(...monthly.map(m => m.amount));

export default function TutorEarnings() {
  return (
    <div className="te-page">
      <div className="te-header">
        <div>
          <h1>Earnings</h1>
          <p>Track your income and payment history</p>
        </div>
        <button className="te-withdraw-btn">💳 Withdraw Funds</button>
      </div>

      <div className="te-stats">
        <div className="te-stat-card te-stat-card--highlight">
          <span className="te-stat-icon">💰</span>
          <span className="te-stat-value">Rs 72,000</span>
          <span className="te-stat-label">This Month</span>
        </div>
        <div className="te-stat-card">
          <span className="te-stat-icon">📈</span>
          <span className="te-stat-value">Rs 2,47,000</span>
          <span className="te-stat-label">Total Earned</span>
        </div>
        <div className="te-stat-card">
          <span className="te-stat-icon">⏳</span>
          <span className="te-stat-value">Rs 12,000</span>
          <span className="te-stat-label">Pending</span>
        </div>
        <div className="te-stat-card">
          <span className="te-stat-icon">📅</span>
          <span className="te-stat-value">44</span>
          <span className="te-stat-label">Sessions This Month</span>
        </div>
      </div>

      <div className="te-cols">
        {/* Bar Chart */}
        <section className="te-section">
          <h2>Monthly Overview</h2>
          <div className="te-chart">
            {monthly.map(m => (
              <div className="te-bar-wrap" key={m.month}>
                <div className="te-bar-amount">Rs {(m.amount / 1000).toFixed(0)}k</div>
                <div className="te-bar-track">
                  <div className="te-bar-fill" style={{ height: `${(m.amount / maxAmount) * 100}%` }} />
                </div>
                <div className="te-bar-month">{m.month}</div>
                <div className="te-bar-sessions">{m.sessions} sessions</div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="te-section">
          <h2>Recent Transactions</h2>
          <div className="te-transactions">
            {transactions.map(t => (
              <div className="te-transaction" key={t.id}>
                <div className="te-t-avatar">{t.avatar}</div>
                <div className="te-t-info">
                  <p className="te-t-name">{t.student}</p>
                  <p className="te-t-course">{t.course} · {t.date}</p>
                </div>
                <span className="te-t-amount">+Rs {t.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}