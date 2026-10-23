import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const homeFor = (role: string) =>
  role === 'admin' ? '/dashboard/admin' : role === 'tutor' ? '/dashboard/tutor' : '/dashboard/student'

// Wrap a page to require login (and optionally a specific role).
export default function RequireRole({
  roles,
  children,
}: {
  roles?: string[]
  children: React.ReactElement
}) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homeFor(user.role)} replace />
  }
  return children
}
