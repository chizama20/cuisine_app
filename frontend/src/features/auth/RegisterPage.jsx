import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from './auth.api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import './auth.css';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await authAPI.register({ firstName, lastName, email, phone, password, address });
      if (res.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <h1 className="auth-heading">Create an account.</h1>
          <p className="auth-subheading">Join and start sharing recipes with the world.</p>

          {error && <p className="error">{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form-row">
              <Input
                label="First Name"
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
              <Input
                label="Last Name"
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>
            <Input
              label="Email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Input
              label="Address"
              type="text"
              placeholder="Your address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
            />
            <Button type="submit">Create Account</Button>
          </form>

          <p className="auth-switch">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
