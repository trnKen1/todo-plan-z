import type { Task } from '../types';
import { fetchTodoistTasks } from './todoist';

// Helper to get dates relative to today
const getRelativeDate = (daysOffset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString();
};

let localTasks: Task[] = [
  {
    id: 'local-1',
    title: 'Design UI mockup',
    status: 'in-progress',
    source: 'local',
    colorCode: '#8b5cf6', // Purple hue for this task
    nodes: [
      {
        id: 'node-1',
        parentId: 'local-1',
        date: getRelativeDate(0), // Today
        isCompleted: true,
        dailyNotes: 'Wireframes'
      },
      {
        id: 'node-2',
        parentId: 'local-1',
        date: getRelativeDate(1), // Tomorrow
        isCompleted: false,
        dailyNotes: 'High fidelity mockups'
      },
      {
        id: 'node-3',
        parentId: 'local-1',
        date: getRelativeDate(2), // Day after tomorrow
        isCompleted: false,
        dailyNotes: 'Prototyping & Feedback'
      }
    ]
  },
  {
    id: 'local-2',
    title: 'Setup Vite project',
    status: 'done',
    source: 'local',
  }
];

export const getAllTasks = async (): Promise<Task[]> => {
  const todoistTasks = await fetchTodoistTasks();
  return [...localTasks, ...todoistTasks];
};

export const addLocalTask = (task: Omit<Task, 'id' | 'source'>) => {
  const newTask: Task = {
    ...task,
    id: `local-${Date.now()}`,
    source: 'local'
  };
  localTasks.push(newTask);
  return newTask;
};
