import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from './auth.api';
import PageLayout from '../../components/layout/PageLayout';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await authAPI.login({ identifier, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <PageLayout>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', color: '#007bff', marginBottom: '20px' }}>Login</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Email or Phone Number" value={identifier} onChange={e => setIdentifier(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" style={{ marginTop: '10px' }}>Login</button>
      </form>
    </PageLayout>
  );
};

export default LoginPage;
