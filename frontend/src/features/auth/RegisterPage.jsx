import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from './auth.api';
import PageLayout from '../../components/layout/PageLayout';

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
      const res = await authAPI.register({
        firstName,
        lastName,
        email,
        phone,
        password,
        address
      });
      if (res.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <PageLayout>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', color: '#007bff', marginBottom: '20px' }}>Register</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
        <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required />
        <button type="submit" style={{ marginTop: '10px' }}>Register</button>
      </form>
    </PageLayout>
  );
};

export default RegisterPage;
