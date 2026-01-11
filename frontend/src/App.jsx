import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStores from './pages/admin/ManageStores';
import ManageUsers from './pages/admin/ManageUsers';

import UserStores from './pages/user/UserStores';
import UpdatePassword from './pages/user/UpdatePassword';

import StoreDashboard from './pages/store/StoreDashboard';

import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <div className="main-content">
            <Routes>
              { }
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              { }
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/stores"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ManageStores />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ManageUsers />
                  </ProtectedRoute>
                }
              />

              { }
              <Route
                path="/user/stores"
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <UserStores />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/password"
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <UpdatePassword />
                  </ProtectedRoute>
                }
              />

              { }
              <Route
                path="/store/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                    <StoreDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/store/password"
                element={
                  <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                    <UpdatePassword />
                  </ProtectedRoute>
                }
              />

              { }
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
