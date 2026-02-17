import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleMakeRecipe = () => {
    navigate('/create-recipe');
  };

  return (
    <PageLayout>
      <h2 style={{ fontSize: '2rem', color: '#007bff', textAlign: 'center', marginBottom: '20px' }}>Dashboard</h2>

      <div style={{ backgroundColor: '#f8f9fa', padding: '40px', borderRadius: '8px', marginBottom: '30px', textAlign: 'center' }}>
        <h3 style={{ marginTop: 0, color: '#007bff' }}>Welcome to Your Dashboard!</h3>
        <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.6' }}>
          You are now logged in. This is a protected route that requires authentication.
        </p>
        <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.6', marginTop: '15px' }}>
          You can use this dashboard as a starting point for your new application.
        </p>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '30px', border: '2px solid #007bff', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#007bff' }}>Ready to Build</h3>
        <p style={{ margin: 0, color: '#666', fontSize: '1.1rem' }}>
          Start adding your app features here!
        </p>
      </div>
      <div style={{ backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '8px', marginBottom: '30px', textAlign: 'center' }}>
        <button onClick={handleMakeRecipe} style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
          Make a recipe
        </button>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;
