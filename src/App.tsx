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
// import TutorDashboard from './pages/TutorDashboard'

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
        {/* <Route path="/dashboard/tutor" element={<TutorDashboard />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App