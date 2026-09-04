import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import DashboardAdmin from './admin/DashboardAdmin'
import InspectMitra from './admin/InspectMitra'
import ManageMitra from './admin/ManageMitra'
import HomeKasir from './mitra/HomeKasir'
import Gudang from './mitra/Gudang'
import Statistik from './mitra/Statistik'
import './index.css'

const formatRupiah = (amount) => {
  if (amount === undefined || amount === null) return 'Rp0'
  return 'Rp' + amount.toLocaleString('id-ID')
}

const App = () => {
  const { session, login, logout } = useAuth()

  // If not logged in, show login/register
  if (!session.isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // If admin, show admin layout with routing
  if (session.role === 'admin') {
    return (
      <Routes>
        <Route path="/admin" element={
          <div className="min-h-screen bg-background p-4">
            <header className="mb-6">
              <h1 className="text-2xl font-bold">Dashboard Admin</h1>
              <button onClick={() => logout()} className="ml-4 btn btn-outline">
                Logout
              </button>
            </header>
            <div className="grid grid-cols-1 gap-6">
              <Routes>
                <Route path="/" element={
                  <Navigate to="/admin/mitra" replace />
                } />
                <Route path="/admin/mitra/:id" element={<InspectMitra />} />
              </Routes>
            </div>
            <div className="mt-6">
              <Routes>
                <Route path="/admin/mitra" element={<ManageMitra />} />
              </Routes>
            </div>
          </div>
        } />
      </Routes>
    )
  }

  // If mitra, show mitra layout with routing
  if (session.role === 'mitra') {
    return (
      <Routes>
        <Route path="/home" element={<HomeKasir />} />
        <Route path="/gudang" element={<Gudang />} />
        <Route path="/statistik" element={<Statistik />} />
      </Routes>
    )
  }

  // Default - redirect to login
  return <Navigate to="/login" replace />
}

export default App