import React from 'react';
import './Textarea.css';

export default function Textarea({ value, onChange, placeholder = '', rows = 3, style = {}, ...props }) {
  return (
    <textarea
      className="ui-textarea"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={style}
      {...props}
    />
  );
}
