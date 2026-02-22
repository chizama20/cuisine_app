import React from 'react';
import Navbar from './Navbar';
import './PageLayout.css';

const PageLayout = ({ children, hero }) => (
  <div className="page-layout">
    <Navbar />
    {hero && <div className="page-hero-slot">{hero}</div>}
    <main className="page-content">
      {children}
    </main>
  </div>
);

export default PageLayout;
