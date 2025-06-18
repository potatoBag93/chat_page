import React from 'react';
import './Button.css';

export default function Button({ children, onClick, type = 'button', style = {}, ...props }) {
  return (
    <button className="ui-btn" type={type} onClick={onClick} style={style} {...props}>
      {children}
    </button>
  );
}
