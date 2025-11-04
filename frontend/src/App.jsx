import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import BookingPage from './pages/BookingPage'
import ServiceAdminPage from './pages/admin/ServiceAdminPage'
import UserPage from './pages/admin/UserPage'
import EmployeesPage from './pages/admin/EmployeesPage'
import BookingAdminPage from './pages/admin/BookingAdminPage'
import LoginPage from './pages/LoginPage'
import ServicePage from './pages/ServicePage'
import MyBookingsPage from './pages/MyBookingsPage'
import { useEffect } from 'react'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          {/* Admin oldalak */}
          <Route path="/admin/services" element={<ServiceAdminPage />} />
          <Route path="/admin/users" element={<UserPage />} />
          <Route path="/admin/employees" element={<EmployeesPage />} />
          <Route path="/admin/bookings" element={<BookingAdminPage />} />
          <Route path='/admin' element={<AdminDashboardPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>


    </>
  )
}

export default App
