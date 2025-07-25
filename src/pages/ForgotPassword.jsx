import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      await axios.post('https://api.lokihere.me/api/admin/request-reset', { email });
      toast.success('Check your email for the reset link!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error requesting reset');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>🔐 Forgot Password</h2>
      <input
        type="email"
        placeholder="📧 Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubmit}>Request Reset Link</button>
      <ToastContainer />
    </div>
  );
}
