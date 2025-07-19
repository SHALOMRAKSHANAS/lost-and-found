import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLoginForm from './components/AdminLoginForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import FileLostItemForm from './components/FileLostItemForm';
import ViewLostItemsPage from './components/ViewLostItemsPage';
import AdminDashboard from './components/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" />} />
        <Route path="/admin" element={<AdminLoginForm />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/file-lost-item" element={<FileLostItemForm />} />
        <Route path="/view-items" element={<ViewLostItemsPage />} />
        <Route path="*" element={<Navigate to="/admin" />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />

      </Routes>
    </Router>
  );
}

export default App;
