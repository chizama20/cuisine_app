import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', className = '', ...props }) => (
  <button className={`btn btn--${variant} ${className}`} {...props}>
    {children}
  </button>
);

export default Button;
