import React, { useState, useEffect } from 'react';
import { userAPI } from './profile.api';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import './ProfilePage.css';

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
      <h2 className="page-heading">
        Welcome, {user?.firstName}!
      </h2>

      {error && <p className="error">{error}</p>}

      {user && (
        <Card>
          <h3 className="section-title">Your Information</h3>
          <div className="profile-fields">
            <div className="profile-field">
              <span className="profile-label">Name</span>
              <span className="profile-value">{user.firstName} {user.lastName}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Email</span>
              <span className="profile-value">{user.email}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Phone</span>
              <span className="profile-value">{user.phone}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Address</span>
              <span className="profile-value">{user.address}</span>
            </div>
          </div>
        </Card>
      )}
    </PageLayout>
  );
};

export default ProfilePage;
