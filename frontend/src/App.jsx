import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import BookingPage from './pages/BookingPage'
import ServicePage from './pages/admin/ServicePage'
import UserPage from './pages/admin/UserPage'
import EmployeesPage from './pages/admin/EmployeesPage'
import BookingsPage from './pages/admin/BookingsPage'
import LoginPage from './pages/LoginPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Admin oldalak */}
          <Route path="/admin/services" element={<ServicePage />} />
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
