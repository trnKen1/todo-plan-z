import React, { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  currentView: 'calendar' | 'board';
  onViewChange: (view: 'calendar' | 'board') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  return (
    <div className="app-container">
      <Sidebar currentView={currentView} onViewChange={onViewChange} />
      <main className="main-content">
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{currentView === 'calendar' ? 'Calendar' : 'Board'}</h2>
          <div>
            <span className="source-badge" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.875rem' }}>
              Connected: Google Calendar, Todoist
            </span>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};
