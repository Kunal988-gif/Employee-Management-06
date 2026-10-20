import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ApplyLeavePage from './pages/ApplyLeavePage';
import MyLeavesPage from './pages/MyLeavesPage';
import LeaveDetailPage from './pages/LeaveDetailPage';
import LeaveTypesListPage from './pages/LeaveTypesListPage';
import AddLeaveTypePage from './pages/AddLeaveTypePage';
import EditLeaveTypePage from './pages/EditLeaveTypePage';
import AdminRequestsPage from './pages/AdminRequestsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

import { getProfile } from './api/authApi';

function App() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || '';
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    if (token) {
      getProfile(token).then((data) => {
        if (!data || !data.success) {
          handleLogout();
        } else if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }).catch(() => {
      });
    }
  }, [token]);

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        <Route
          path="/"
          element={
            user ? (
              user.role === 'admin' ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/my-leaves" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/my-leaves'} replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/my-leaves'} replace />
            ) : (
              <RegisterPage onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/apply-leave"
          element={
            <ProtectedRoute user={user} allowedRole="employee">
              <ApplyLeavePage token={token} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-leaves"
          element={
            <ProtectedRoute user={user} allowedRole="employee">
              <MyLeavesPage token={token} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-leaves/:id"
          element={
            <ProtectedRoute user={user}>
              <LeaveDetailPage token={token} user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute user={user} allowedRole="admin">
              <AdminDashboardPage token={token} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute user={user} allowedRole="admin">
              <AdminRequestsPage token={token} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leave-types"
          element={
            <ProtectedRoute user={user} allowedRole="admin">
              <LeaveTypesListPage token={token} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leave-types/new"
          element={
            <ProtectedRoute user={user} allowedRole="admin">
              <AddLeaveTypePage token={token} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leave-types/:id/edit"
          element={
            <ProtectedRoute user={user} allowedRole="admin">
              <EditLeaveTypePage token={token} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
