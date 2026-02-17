import React from 'react';
import './Input.css';

const Input = ({ label, className = '', ...props }) => (
  <div className={`form-group ${className}`}>
    {label && <label>{label}</label>}
    {props.type === 'textarea' ? (
      <textarea {...{ ...props, type: undefined }} />
    ) : (
      <input {...props} />
    )}
  </div>
);

export default Input;
