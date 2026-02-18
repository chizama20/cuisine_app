import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from './auth.api';
import useAuth from '../../hooks/useAuth';
import PageLayout from '../../components/layout/PageLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

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
    <PageLayout>
      <h2 className="page-heading">Login</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
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
    </PageLayout>
  );
};

export default LoginPage;
