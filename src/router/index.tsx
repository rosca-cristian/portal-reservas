import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import AdminLayout from '@/layouts/AdminLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Pages
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Spaces from '@/pages/Spaces'
import Booking from '@/pages/Booking'
import MyReservations from '@/pages/MyReservations'
import Profile from '@/pages/Profile'
import BookingConfirmation from '@/pages/BookingConfirmation'
import JoinInvitationPage from '@/pages/JoinInvitation/JoinInvitationPage'
import NotFound from '@/pages/NotFound'
import Unauthorized from '@/pages/Unauthorized'

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminSpaces from '@/pages/admin/AdminSpaces'
import AdminReservations from '@/pages/admin/AdminReservations'
import AdminReports from '@/pages/admin/Reports'
import AdminSettings from '@/pages/admin/Settings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'spaces',
        element: (
          <ProtectedRoute>
            <Spaces />
          </ProtectedRoute>
        ),
      },
      {
        path: 'booking',
        element: (
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-reservations',
        element: (
          <ProtectedRoute>
            <MyReservations />
          </ProtectedRoute>
        ),
      },
      {
        path: 'booking/confirmation/:id',
        element: (
          <ProtectedRoute>
            <BookingConfirmation />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'join/:token',
        element: (
          <ProtectedRoute>
            <JoinInvitationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'unauthorized',
        element: <Unauthorized />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute roles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'spaces',
        element: <AdminSpaces />,
      },
      {
        path: 'reservations',
        element: <AdminReservations />,
      },
      {
        path: 'reports',
        element: <AdminReports />,
      },
      {
        path: 'settings',
        element: <AdminSettings />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
