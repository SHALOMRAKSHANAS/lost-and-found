import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', 
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // ✅ Store token
      localStorage.setItem('adminToken', res.data.token);

      // ✅ Navigate to dashboard
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('Login error:', err);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="email"
            className="input-field"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            className="input-field"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="forgot-password">
          <button
            type="button"
            className="link-button"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot password?
          </button>
        </div>

        <button type="submit" className="login-button">LOGIN</button>
      </form>

      <button
        type="button"
        className="button-link"
        onClick={() => navigate('/file-lost-item')}
      >
        📂 File for Lost Item
      </button>

      <button
        type="button"
        className="button-link"
        onClick={() => navigate('/view-items')}
      >
        🔍 View Lost Items
      </button>
    </div>
  );
}

export default AdminLoginForm;
