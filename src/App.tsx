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
import Reviews from './pages/Reviews';
import ForgotPassword from './pages/ForgotPassword'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Add more routes here as you build more pages: */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/tutor/:id"      element={<TutorProfile />} />
        
        // Add inside Routes:
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Student Dashboard */}
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/courses" element={<MyCourses />} />
        <Route path="/dashboard/sessions" element={<MySessions />} />
        <Route path="/dashboard/profile" element={<MyProfile />} />
        <Route path="/dashboard/find-tutors" element={<FindTutors />} />
        <Route path="/dashboard/tutor" element={<TutorDashboard />} />
        <Route path="/dashboard/tutor/sessions"  element={<TutorSessions />} />
        <Route path="/dashboard/tutor/courses"   element={<TutorCourses />} />
        <Route path="/dashboard/tutor/profile" element={<MyProfile />} />
        <Route path="/dashboard/tutor/students"  element={<TutorStudents />} />
        <Route path="/dashboard/tutor/earnings"  element={<TutorEarnings />} />
        {/* <Route path="/dashboard/tutor" element={<TutorDashboard />} /> */}
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/admin/users" element={<AdminUsers />} />
        <Route path="/dashboard/admin/tutors" element={<AdminTutors />} />
        <Route path="/dashboard/admin/courses" element={<AdminCourses />} />
        <Route path="/dashboard/admin/bookings" element={<AdminBookings />} />
        <Route path="/dashboard/admin/earnings" element={<AdminEarnings />} />
        <Route path="/tutor/:id/reviews" element={<Reviews />} />
        <Route path="/dashboard/tutor/reviews" element={<Reviews />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App