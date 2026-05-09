import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

interface Props {
  bookings: any[];
  users: any[];
  courses: any[];
}

const COLORS = ["#6c63ff", "#ff6b35", "#27ae60", "#e74c3c", "#f39c12"];

export default function AdminCharts({ bookings, users, courses }: Props) {

  // Subject popularity from courses
  const subjectMap: Record<string, number> = {};
  courses.forEach(c => {
    const sub = Array.isArray(c.subject) ? c.subject[0] : c.subject;
    subjectMap[sub] = (subjectMap[sub] || 0) + (c.studentsEnrolled || 0);
  });
  const subjectData = Object.entries(subjectMap)
    .map(([name, students]) => ({ name, students }))
    .sort((a, b) => b.students - a.students)
    .slice(0, 6);

  // Booking status breakdown
  const statusData = [
    { name: "Confirmed", value: bookings.filter(b => b.status === "Confirmed").length },
    { name: "Pending", value: bookings.filter(b => b.status === "Pending").length },
    { name: "Completed", value: bookings.filter(b => b.status === "Completed").length },
    { name: "Cancelled", value: bookings.filter(b => b.status === "Cancelled").length },
  ].filter(s => s.value > 0);

  // User roles breakdown
  const roleData = [
    { name: "Students", value: users.filter(u => u.role === "student").length },
    { name: "Tutors", value: users.filter(u => u.role === "tutor").length },
  ];

  // Revenue per subject
  const revenueData = Object.entries(subjectMap)
    .map(([name, students]) => ({
      name,
      revenue: students * 1200
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>

      {/* Subject Popularity */}
      <div style={{ background: "white", borderRadius: 14, padding: "1.5rem", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
        <h3 style={{ margin: "0 0 1rem", color: "var(--dark)", fontSize: "1rem" }}>
          📚 Subject Popularity
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={subjectData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="students" fill="#6c63ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Booking Status Pie */}
      <div style={{ background: "white", borderRadius: 14, padding: "1.5rem", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
        <h3 style={{ margin: "0 0 1rem", color: "var(--dark)", fontSize: "1rem" }}>
          📅 Booking Status
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {statusData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue by Subject */}
      <div style={{ background: "white", borderRadius: 14, padding: "1.5rem", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
        <h3 style={{ margin: "0 0 1rem", color: "var(--dark)", fontSize: "1rem" }}>
          💰 Estimated Revenue by Subject
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(value: any) => `Rs ${value.toLocaleString()}`} />
            <Bar dataKey="revenue" fill="#ff6b35" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Users Breakdown Pie */}
      <div style={{ background: "white", borderRadius: 14, padding: "1.5rem", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
        <h3 style={{ margin: "0 0 1rem", color: "var(--dark)", fontSize: "1rem" }}>
          👥 Users Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={roleData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {roleData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}