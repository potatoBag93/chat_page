import React from 'react';
import '../styles/CommonUI.css';

export default function CommonHeader({ children, style }) {
  return <header className="common-header" style={style}>{children}</header>;
}
