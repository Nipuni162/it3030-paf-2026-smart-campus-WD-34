import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { Dashboard } from './pages/Dashboard';
import { BookingPage } from './pages/BookingPage';
import { TicketListPage } from './pages/tickets/TicketListPage';
import { TicketDetailsPage } from './pages/tickets/TicketDetailsPage';
import { CreateTicketPage } from './pages/tickets/CreateTicketPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ResourceManagementPage } from './pages/admin/ResourceManagementPage';
import { BookingManagementPage } from './pages/admin/BookingManagementPage';
import { MyTicketsPage } from './pages/tickets/MyTicketsPage';
import { TechnicianTicketDetailsPage } from './pages/tickets/TechnicianTicketDetailsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { MyBookingsPage } from './pages/bookings/MyBookingsPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { AdminNoticePage } from './pages/admin/AdminNoticePage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-right" expand={false} richColors />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Dashboard Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="bookings" element={<BookingPage />} />
              <Route path="my-bookings" element={<MyBookingsPage />} />
              
              {/* Ticketing Module */}
              <Route path="tickets">
                <Route index element={<TicketListPage />} />
                <Route path="create" element={<CreateTicketPage />} />
                <Route path=":id" element={<TicketDetailsPage />} />
              </Route>

              {/* Admin Routes */}
              <Route path="admin" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="admin/resources" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ResourceManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/bookings" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <BookingManagementPage />
                </ProtectedRoute>
              } />
              <Route path="admin/notices" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminNoticePage />
                </ProtectedRoute>
              } />
              
              <Route path="notifications" element={<NotificationsPage />} />

              {/* Technician Specific Routes */}
              <Route path="technician">
                <Route path="tickets" element={
                  <ProtectedRoute allowedRoles={['TECHNICIAN']}>
                    <MyTicketsPage />
                  </ProtectedRoute>
                } />
                <Route path="tickets/:id" element={
                  <ProtectedRoute allowedRoles={['TECHNICIAN']}>
                    <TechnicianTicketDetailsPage />
                  </ProtectedRoute>
                } />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
