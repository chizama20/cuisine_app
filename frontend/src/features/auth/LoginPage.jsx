import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from './auth.api';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import './auth.css';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await authAPI.login({ identifier, password });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-panel-left">
        <Link to="/" className="auth-brand">Cuisine</Link>

        <div className="auth-tagline">
          <span className="auth-tagline-line">Cook.</span>
          <span className="auth-tagline-line">Share.</span>
          <span className="auth-tagline-line auth-tagline-line--muted">Explore.</span>
        </div>

        <p className="auth-panel-footnote">© Cuisine</p>
      </div>

      {/* Right panel */}
      <div className="auth-panel-right">
        <div className="auth-form-wrap">
          <h1 className="auth-heading">Welcome back.</h1>
          <p className="auth-subheading">Sign in to your account to continue.</p>

          {error && <p className="error">{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              label="Email or Phone"
              type="text"
              placeholder="Enter your email or phone"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Button type="submit">Login</Button>
          </form>

          <p className="auth-switch">
            New to Cuisine?
            <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
