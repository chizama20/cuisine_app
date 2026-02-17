import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <h2 className="page-heading">Dashboard</h2>

      <Card centered>
        <h3 className="section-title">Welcome to Your Dashboard!</h3>
        <p className="content-text">
          You are now logged in. This is a protected route that requires authentication.
        </p>
        <p className="content-text mt-2">
          You can use this dashboard as a starting point for your new application.
        </p>
      </Card>

      <Card centered variant="outlined">
        <h3 className="section-title">Ready to Build</h3>
        <p className="content-text">
          Start adding your app features here!
        </p>
      </Card>

      <Card centered>
        <Button variant="secondary" onClick={() => navigate('/create-recipe')}>
          Create a Recipe
        </Button>
      </Card>
    </PageLayout>
  );
};

export default DashboardPage;
