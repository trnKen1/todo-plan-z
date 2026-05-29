import type { Task } from '../types';

export const fetchTodoistTasks = async (): Promise<Task[]> => {
  // Stub for OAuth flow and fetching from Todoist REST API
  console.log('Fetching Todoist tasks...');
  return [
    {
      id: 'td-1',
      title: 'Buy groceries',
      status: 'todo',
      source: 'todoist',
      dueDate: new Date(Date.now() + 86400000).toISOString()
    }
  ];
};
