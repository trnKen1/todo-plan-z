export type TaskSource = 'local' | 'todoist' | 'google-calendar';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  source: TaskSource;
  dueDate?: string; // ISO date string
  sourceId?: string; // ID from the original source
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  source: TaskSource;
  sourceId?: string;
}
