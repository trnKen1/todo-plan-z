import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { BoardView } from './components/board/BoardView';
import { CalendarView } from './components/calendar/CalendarView';
import type { Task } from './types';
import { getAllTasks } from './services/taskManager';

function App() {
  const [currentView, setCurrentView] = useState<'calendar' | 'board'>('board');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const fetchedTasks = await getAllTasks();
        setTasks(fetchedTasks);
      } catch (e) {
        console.error("Failed to load tasks", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <p>Loading tasks from Todoist & Google Calendar...</p>
        </div>
      ) : (
        <>
          {currentView === 'board' ? (
            <BoardView tasks={tasks} />
          ) : (
            <CalendarView tasks={tasks} />
          )}
        </>
      )}
    </Layout>
  );
}

export default App;
