import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock } from 'lucide-react';
import { loginUser } from '../services/authService';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-glass-card glass-morphism">
        <div className="login-header">
          <div className="login-logo">NURAGRO</div>
          <h1>Admin Access</h1>
          <p>Please enter your credentials to manage the catalog.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group-login">
            <label><User size={16} /> Username</label>
            <input 
              type="text" 
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>

          <div className="form-group-login">
            <label><Lock size={16} /> Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit-btn">
            Sign In <LogIn size={18} />
          </button>
        </form>

        <div className="login-footer">
          <button className="back-link" onClick={() => navigate('/')}>
            Back to Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
