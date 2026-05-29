import React from 'react';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const getSourceColor = (source: string) => {
    switch(source) {
      case 'todoist': return '#e44332';
      case 'google-calendar': return '#4285f4';
      default: return '#3b82f6';
    }
  };

  return (
    <div className="glass-panel task-card">
      <h4>{task.title}</h4>
      {task.description && <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{task.description}</p>}
      <span 
        className="source-badge" 
        style={{ color: getSourceColor(task.source) }}
      >
        {task.source}
      </span>
      {task.dueDate && (
        <span className="source-badge" style={{ marginLeft: '0.5rem', color: '#94a3b8' }}>
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      )}
    </div>
  );
};
