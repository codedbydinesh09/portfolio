import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminLayout } from './components/admin/AdminLayout';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { HeroCMS } from './pages/admin/HeroCMS';
import { AboutCMS } from './pages/admin/AboutCMS';
import { ProjectsCMS } from './pages/admin/ProjectsCMS';
import { SkillsCMS } from './pages/admin/SkillsCMS';
import { CertificatesCMS } from './pages/admin/CertificatesCMS';
import { Home } from './pages/Home';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="app-container">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="hero" element={<HeroCMS />} />
                <Route path="about" element={<AboutCMS />} />
                <Route path="skills" element={<SkillsCMS />} />
                <Route path="projects" element={<ProjectsCMS />} />
                <Route path="certificates" element={<CertificatesCMS />} />
                <Route path="messages" element={<div>Messages</div>} />
                <Route path="settings" element={<div>Global Settings</div>} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'bg-neu-bg text-neu-text shadow-neu rounded-xl border border-white/20',
              style: {
                background: 'var(--color-neu-bg)',
                color: 'var(--color-neu-text)',
                boxShadow: '8px 8px 16px #C3C9D6, -8px -8px 16px #FFFFFF',
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
