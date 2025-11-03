import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import BookingPage from './pages/BookingPage'
import ServiceAdminPage from './pages/admin/ServiceAdminPage'
import UserPage from './pages/admin/UserPage'
import EmployeesPage from './pages/admin/EmployeesPage'
import BookingsPage from './pages/admin/BookingsPage'
import LoginPage from './pages/LoginPage'
import ServicePage from './pages/ServicePage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/services" element={<ServicePage />} />
          {/* Admin oldalak */}
          <Route path="/admin/services" element={<ServiceAdminPage />} />
          <Route path="/admin/users" element={<UserPage />} />
          <Route path="/admin/employees" element={<EmployeesPage />} />
          <Route path="/admin/bookings" element={<BookingsPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>


    </>
  )
}

export default App
