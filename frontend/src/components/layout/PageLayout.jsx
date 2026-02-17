import React from 'react';
import Navbar from './Navbar';
import './PageLayout.css';

const PageLayout = ({ children }) => (
  <div className="page-layout">
    <Navbar />
    <main className="page-content">
      {children}
    </main>
  </div>
);

export default PageLayout;
