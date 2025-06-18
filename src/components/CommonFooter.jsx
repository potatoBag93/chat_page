import React from 'react';
import '../styles/CommonUI.css';

export default function CommonFooter({ children, style }) {
  return <footer className="common-footer" style={style}>{children}</footer>;
}
