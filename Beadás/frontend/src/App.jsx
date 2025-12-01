import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import ServiceAdminPage from './pages/admin/ServiceAdminPage';
import UserPage from './pages/admin/UserPage';
import EmployeesPage from './pages/admin/EmployeesPage';
import BookingAdminPage from './pages/admin/BookingAdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ServicePage from './pages/ServicePage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Helper function to get current user from localStorage
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user')) || null;
};

// Protected route for non-admin routes
function ProtectedRoute({ children }) {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

// Protected route for admin-only routes
function AdminRoute({ children }) {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    return (
      <div style={{
        color: 'red',
        textAlign: 'center',
        fontSize: '24px',
        padding: '20px',
        backgroundColor: '#ffdddd',
        border: '2px solid red'
      }}>
        Hozzáférés megtagadva. Csak adminisztrátorok számára elérhető.
      </div>
    );
  }
  return children;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        {/* Navigációs sáv */}
        <Navbar user={user} setUser={setUser} />
        <Routes>
          {/* Nyilvános oldalak */}
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          } />
          <Route path="/register" element={<RegisterPage setUser={setUser} />} />

          {/* Admin oldalak */}
          <Route path="/admin/services" element={
            <AdminRoute>
              <ServiceAdminPage />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <UserPage />
            </AdminRoute>
          } />
          <Route path="/admin/employees" element={
            <AdminRoute>
              <EmployeesPage />
            </AdminRoute>
          } />
          <Route path="/admin/bookings" element={
            <AdminRoute>
              <BookingAdminPage />
            </AdminRoute>
          } />
          <Route path='/admin' element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
