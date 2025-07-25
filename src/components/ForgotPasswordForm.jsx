import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';

function ForgotPasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await axios.post('https://api.lokihere.me/api/admin/change-password', {
        oldPassword,
        newPassword,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      alert('Password changed successfully');
    } catch {
      alert('Failed to change password');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Forgot Password</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">Change Password</button>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;
