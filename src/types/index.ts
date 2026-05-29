export type TaskSource = 'local' | 'todoist' | 'google-calendar';

export interface TaskNode {
  id: string;
  parentId: string;
  date: string; // ISO date string for the specific day
  startTime?: string;
  endTime?: string;
  dailyNotes?: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  source: TaskSource;
  dueDate?: string; // ISO date string
  sourceId?: string; // ID from the original source
  colorCode?: string; // Optional color hue for visual linking across days
  nodes?: TaskNode[]; // Linked daily nodes for this task
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  source: TaskSource;
  sourceId?: string;
}
