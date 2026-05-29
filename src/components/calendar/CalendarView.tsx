import React from 'react';
import type { Task } from '../../types';

interface CalendarViewProps {
  tasks: Task[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Create a 35-day grid (5 weeks) for demo purposes
  const days = Array.from({ length: 35 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + i - 14); // start a couple weeks ago
    return d;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="calendar-grid" style={{ gridTemplateRows: 'auto 1fr', flex: 1 }}>
        {/* Header */}
        {daysOfWeek.map(day => (
          <div key={day} className="calendar-header">{day}</div>
        ))}
        
        {/* Days */}
        {days.map((day, idx) => {
          // Find tasks that fall on this day (ignoring time for simplicity)
          const dayTasks = tasks.filter(t => {
            if (!t.dueDate) return false;
            const tDate = new Date(t.dueDate);
            return tDate.toDateString() === day.toDateString();
          });

          return (
            <div key={idx} className="calendar-day">
              <div className="calendar-day-header">
                {day.getDate()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {dayTasks.map(task => (
                  <div 
                    key={task.id}
                    style={{ 
                      fontSize: '0.75rem', 
                      background: task.source === 'todoist' ? 'rgba(228, 67, 50, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                      color: 'var(--text-primary)',
                      padding: '4px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
