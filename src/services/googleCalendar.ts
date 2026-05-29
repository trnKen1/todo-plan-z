import type { CalendarEvent } from '../types';

export const fetchGoogleCalendarEvents = async (): Promise<CalendarEvent[]> => {
  // Stub for OAuth flow and fetching from Google Calendar API
  console.log('Fetching Google Calendar events...');
  return [
    {
      id: 'gc-1',
      title: 'Team Meeting',
      start: new Date().toISOString(),
      end: new Date(Date.now() + 3600000).toISOString(),
      source: 'google-calendar'
    }
  ];
};
