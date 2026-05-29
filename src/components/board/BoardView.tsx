import React from 'react';
import type { Task } from '../../types';
import { TaskCard } from '../TaskCard';

interface BoardViewProps {
  tasks: Task[];
}

export const BoardView: React.FC<BoardViewProps> = ({ tasks }) => {
  const columns: { id: Task['status']; title: string }[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  return (
    <div className="board-container">
      {columns.map(column => (
        <div key={column.id} className="board-column">
          <div className="column-header">
            <h3>{column.title}</h3>
            <span style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.875rem' }}>
              {tasks.filter(t => t.status === column.id).length}
            </span>
          </div>
          <div className="column-content">
            {tasks
              .filter(task => task.status === column.id)
              .map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
