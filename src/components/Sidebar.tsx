import React from 'react';

interface SidebarProps {
  currentView: 'calendar' | 'board';
  onViewChange: (view: 'calendar' | 'board') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="sidebar">
      <div style={{ marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
        TodoApp
      </div>
      
      <button 
        className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`}
        onClick={() => onViewChange('calendar')}
      >
        <span style={{ marginRight: '0.75rem' }}>📅</span> Calendar View
      </button>

      <button 
        className={`nav-item ${currentView === 'board' ? 'active' : ''}`}
        onClick={() => onViewChange('board')}
      >
        <span style={{ marginRight: '0.75rem' }}>📋</span> Board View
      </button>

      <div style={{ marginTop: 'auto' }}>
        <button className="btn-primary" style={{ width: '100%' }}>
          + Add Task
        </button>
      </div>
    </div>
  );
};
