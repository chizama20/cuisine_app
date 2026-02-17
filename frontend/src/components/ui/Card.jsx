import React from 'react';
import './Card.css';

const Card = ({ children, className = '', variant = 'default', centered = false }) => (
  <div className={`card card--${variant} ${centered ? 'card--centered' : ''} ${className}`}>
    {children}
  </div>
);

export default Card;
