import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Report from './pages/Report';
import ReportLost from './pages/ReportLost';
import ReportFound from './pages/ReportFound';
import EditItem from './pages/EditItem';
import ItemDetails from './pages/ItemDetails';
import PotentialMatches from './pages/PotentialMatches';
import Dashboard from './pages/Dashboard';
import Claims from './pages/Claims';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Logout from './pages/Logout';

function AppShell() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Item detail routes (existing convention) */}
          <Route path="/items/:type/:id" element={<ItemDetails />} />
          <Route path="/matches/:type/:id" element={<PotentialMatches />} />

          {/* Alias routes so /lost-items/:id and /found-items/:id also work */}
          <Route path="/lost-items/:id" element={<ItemDetails />} />
          <Route path="/found-items/:id" element={<ItemDetails />} />

          {/* Report landing page — visible without auth so users can see options,
              the actual sub-pages are protected */}
          <Route path="/report" element={<Report />} />

          {/* Authenticated User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-lost"
            element={
              <ProtectedRoute>
                <ReportLost />
              </ProtectedRoute>
            }
          />
          {/* Alias: /report/lost → /report-lost */}
          <Route
            path="/report/lost"
            element={
              <ProtectedRoute>
                <ReportLost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-found"
            element={
              <ProtectedRoute>
                <ReportFound />
              </ProtectedRoute>
            }
          />
          {/* Alias: /report/found → /report-found */}
          <Route
            path="/report/found"
            element={
              <ProtectedRoute>
                <ReportFound />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-item/:type/:id"
            element={
              <ProtectedRoute>
                <EditItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/claims"
            element={
              <ProtectedRoute>
                <Claims />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Matches – accessible to public as item details are public */}
          <Route path="/matches" element={<Navigate to="/search" replace />} />

          {/* Role-Protected Admin Route */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Logout Page */}
          <Route path="/logout" element={<Logout />} />

          {/* 404 Fallback */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
