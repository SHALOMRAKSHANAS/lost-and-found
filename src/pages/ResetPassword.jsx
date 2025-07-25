import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [newPassword, setNewPassword] = useState('');

  const handleReset = async () => {
    if (!newPassword) {
      toast.error('Please enter new password');
      return;
    }

    try {
      await axios.post('https://api.lokihere.me/api/admin/confirm-reset', {
        token,
        newPassword
      });
      toast.success('Password reset successful! You can now login.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>🔑 Reset Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleReset}>Set New Password</button>
      <ToastContainer />
    </div>
  );
}
