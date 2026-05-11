import { useEffect, useState } from "react";
import "./TutorEarnings.css";
import { useAuth } from "../context/AuthContext";

export default function TutorEarnings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/bookings')
      .then(res => res.json())
      .then((data: any[]) => {
        const myBookings = data.filter(b => b.tutor?._id === user?._id);
        setBookings(myBookings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const totalEarnings = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const completedEarnings = bookings
    .filter(b => b.status === 'Completed')
    .reduce((sum, b) => sum + (b.amount || 0), 0);
  const pendingEarnings = bookings
    .filter(b => b.status === 'Pending' || b.status === 'Confirmed')
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  const stats = [
    { icon: '💰', value: `Rs ${totalEarnings.toLocaleString()}`, label: 'Total Earnings', highlight: true },
    { icon: '✅', value: `Rs ${completedEarnings.toLocaleString()}`, label: 'Completed' },
    { icon: '⏳', value: `Rs ${pendingEarnings.toLocaleString()}`, label: 'Pending' },
    { icon: '📅', value: bookings.length, label: 'Total Sessions' },
  ];

  const recentTransactions = [...bookings].reverse().slice(0, 5);

  if (loading) return <div style={{ padding: '2rem' }}>Loading earnings...</div>;

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
        {stats.map(s => (
          <div
            key={s.label}
            className={`te-stat-card ${s.highlight ? 'te-stat-card--highlight' : ''}`}
          >
            <span className="te-stat-icon">{s.icon}</span>
            <span className="te-stat-value">{s.value}</span>
            <span className="te-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="te-cols">

        {/* Booking Status Chart */}
        <section className="te-section">
          <h2>Booking Overview</h2>
          <div style={{ padding: '0.5rem 0' }}>
            {[
              { label: 'Completed', count: bookings.filter(b => b.status === 'Completed').length, color: '#27ae60' },
              { label: 'Confirmed', count: bookings.filter(b => b.status === 'Confirmed').length, color: 'var(--purple)' },
              { label: 'Pending', count: bookings.filter(b => b.status === 'Pending').length, color: 'var(--orange)' },
              { label: 'Cancelled', count: bookings.filter(b => b.status === 'Cancelled').length, color: '#e74c3c' },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: '1rem' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '0.85rem', marginBottom: '0.35rem'
                }}>
                  <span>{item.label}</span>
                  <span style={{ fontWeight: 600 }}>{item.count}</span>
                </div>
                <div style={{
                  height: 8, background: '#ebebf5',
                  borderRadius: 10, overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: bookings.length
                      ? `${(item.count / bookings.length) * 100}%`
                      : '0%',
                    background: item.color,
                    borderRadius: 10
                  }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="te-section">
          <h2>Recent Transactions</h2>
          <div className="te-transactions">
            {recentTransactions.length === 0 ? (
              <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '2rem' }}>
                No transactions yet
              </p>
            ) : (
              recentTransactions.map((t: any) => (
                <div className="te-transaction" key={t._id}>
                  <div className="te-t-avatar">
                    {t.student?.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="te-t-info">
                    <p className="te-t-name">{t.student?.name}</p>
                    <p className="te-t-course">{t.subject} · {t.date}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="te-t-amount">+Rs {t.amount?.toLocaleString()}</span>
                    <p style={{
                      fontSize: '0.75rem', marginTop: '2px',
                      color: t.status === 'Completed' ? '#27ae60' :
                             t.status === 'Cancelled' ? '#e74c3c' : 'var(--orange)'
                    }}>
                      {t.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}