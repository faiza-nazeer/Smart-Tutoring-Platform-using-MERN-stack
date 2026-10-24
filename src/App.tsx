// App.tsx
// React Router lives here. Add new pages by adding a new <Route> below.
// Each page imports its own CSS file — no CSS needed in App.tsx itself.

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

// Later you will import more pages like:
import Login from './pages/Login'
import Signup from './pages/Signup'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import StudentDashboard from './pages/Studentdashboard'
import Booking from './pages/Booking'
import Contact from './pages/Contact'
import About from './components/About'
import TutorProfile from './pages/TutorProfile'
import MyCourses from "./pages/MyCourses";
import MySessions from "./pages/MySessions";
import MyProfile from "./pages/MyProfile";
import FindTutors from "./pages/FindTutors";
import TutorDashboard from './pages/TutorDashboard';
import TutorSessions     from './pages/TutorSessions';
import TutorCourses      from './pages/TutorCourses';
import TutorStudents     from './pages/TutorStudents';
import TutorEarnings     from './pages/TutorEarnings';
// import TutorDashboard from './pages/TutorDashboard'
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminTutors from "./pages/AdminTutors";
import AdminCourses from "./pages/AdminCourses";
import AdminBookings from "./pages/AdminBookings";
import AdminEarnings from "./pages/AdminEarnings";
import AdminSettings from "./pages/AdminSettings";
import Reviews from './pages/Reviews';
import ForgotPassword from './pages/ForgotPassword'
import NotFound from './pages/NotFound'
import TutorProfileEdit from './pages/TutorProfileEdit'
import RequireRole from './components/RequireRole'


function App() {
  const student = ['student']
  const tutor = ['tutor']
  const admin = ['admin']

  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/tutor/:id" element={<TutorProfile />} />
        <Route path="/tutor/:id/reviews" element={<Reviews />} />

        {/* Booking: any logged-in user, for a specific tutor */}
        <Route path="/booking" element={<RequireRole><Booking /></RequireRole>} />
        <Route path="/booking/:tutorId" element={<RequireRole><Booking /></RequireRole>} />

        {/* Student area */}
        <Route path="/dashboard/student" element={<RequireRole roles={student}><StudentDashboard /></RequireRole>} />
        <Route path="/dashboard/courses" element={<RequireRole roles={student}><MyCourses /></RequireRole>} />
        <Route path="/dashboard/sessions" element={<RequireRole roles={student}><MySessions /></RequireRole>} />
        <Route path="/dashboard/profile" element={<RequireRole roles={['student', 'tutor']}><MyProfile /></RequireRole>} />
        <Route path="/dashboard/find-tutors" element={<RequireRole roles={student}><FindTutors /></RequireRole>} />

        {/* Tutor area */}
        <Route path="/dashboard/tutor" element={<RequireRole roles={tutor}><TutorDashboard /></RequireRole>} />
        <Route path="/dashboard/tutor/sessions" element={<RequireRole roles={tutor}><TutorSessions /></RequireRole>} />
        <Route path="/dashboard/tutor/courses" element={<RequireRole roles={tutor}><TutorCourses /></RequireRole>} />
        <Route path="/dashboard/tutor/students" element={<RequireRole roles={tutor}><TutorStudents /></RequireRole>} />
        <Route path="/dashboard/tutor/earnings" element={<RequireRole roles={tutor}><TutorEarnings /></RequireRole>} />
        <Route path="/dashboard/tutor/reviews" element={<RequireRole roles={tutor}><Reviews /></RequireRole>} />
        <Route path="/dashboard/tutor/profile" element={<RequireRole roles={tutor}><TutorProfileEdit /></RequireRole>} />

        {/* Admin area */}
        <Route path="/dashboard/admin" element={<RequireRole roles={admin}><AdminDashboard /></RequireRole>} />
        <Route path="/dashboard/admin/users" element={<RequireRole roles={admin}><AdminUsers /></RequireRole>} />
        <Route path="/dashboard/admin/tutors" element={<RequireRole roles={admin}><AdminTutors /></RequireRole>} />
        <Route path="/dashboard/admin/courses" element={<RequireRole roles={admin}><AdminCourses /></RequireRole>} />
        <Route path="/dashboard/admin/bookings" element={<RequireRole roles={admin}><AdminBookings /></RequireRole>} />
        <Route path="/dashboard/admin/earnings" element={<RequireRole roles={admin}><AdminEarnings /></RequireRole>} />
        <Route path="/dashboard/admin/settings" element={<RequireRole roles={admin}><AdminSettings /></RequireRole>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
