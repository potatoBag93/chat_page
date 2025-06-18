import React from 'react';
import './Input.css';

export default function Input({ value, onChange, placeholder = '', type = 'text', style = {}, ...props }) {
  return (
    <input
      className="ui-input"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={style}
      {...props}
    />
  );
}
