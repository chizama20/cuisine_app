import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from './auth.api';
import PageLayout from '../../components/layout/PageLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

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
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <PageLayout>
      <h2 className="page-heading">Register</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <Input label="First Name" type="text" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
        <Input label="Last Name" type="text" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} required />
        <Input label="Email" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input label="Phone" type="tel" placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} required />
        <Input label="Password" type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required />
        <Input label="Address" type="text" placeholder="Your address" value={address} onChange={e => setAddress(e.target.value)} required />
        <Button type="submit">Register</Button>
      </form>
    </PageLayout>
  );
};

export default RegisterPage;
