import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/ui/Card';
import './HomePage.css';

const HomePage = () => {
  return (
    <PageLayout>
      <div className="home-hero">
        <h1 className="page-heading">Welcome to RecipeApp</h1>
        <p className="content-text text-center">
          Discover, create, and share your favorite recipes with the community.
        </p>
      </div>
      <Card centered>
        <h3 className="section-title">Get Started</h3>
        <p className="content-text">
          Sign in to start creating and sharing your culinary creations.
        </p>
      </Card>
    </PageLayout>
  );
};

export default HomePage;
