import type { Task } from '../types';
import { fetchTodoistTasks } from './todoist';


let localTasks: Task[] = [
  {
    id: 'local-1',
    title: 'Design UI mockup',
    status: 'in-progress',
    source: 'local',
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
  // In a real app we might also fetch calendar events and map them to tasks if applicable.
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
