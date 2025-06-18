import React from 'react';

export default function ThreeColumnLayout({ children }) {
  return (
    <div className="layout-3col">
      <aside className="side-col left-col" aria-hidden="true"></aside>
      <main className="center-col">{children}</main>
      <aside className="side-col right-col" aria-hidden="true"></aside>
    </div>
  );
}
