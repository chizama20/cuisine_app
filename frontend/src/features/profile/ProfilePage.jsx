import React, { useState, useEffect } from 'react';
import { userAPI } from './profile.api';
import PageLayout from '../../components/layout/PageLayout';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <div className="loading">Loading...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', color: '#007bff', marginBottom: '20px' }}>
        Welcome to Your Profile, {user?.firstName}!
      </h2>

      {error && <p className="error">{error}</p>}

      {user && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '8px', marginBottom: '30px' }}>
          <h3 style={{ marginTop: 0, color: '#007bff' }}>Your Information</h3>
          <div style={{ fontSize: '1.1rem', color: '#555', lineHeight: '2' }}>
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Address:</strong> {user.address}</p>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default ProfilePage;
