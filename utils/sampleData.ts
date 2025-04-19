import { Habit } from '@/types';

export function generateSampleHabits(): Habit[] {
  return [
    {
      id: '1',
      title: 'Morning Meditation',
      category: 'health',
      frequency: [0, 1, 2, 3, 4, 5, 6], // Every day
      completed: false,
      notes: '10 minutes of mindfulness',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Read for 30 minutes',
      category: 'education',
      frequency: [1, 3, 5], // Monday, Wednesday, Friday
      completed: false,
      notes: 'Science fiction or philosophy books',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Workout',
      category: 'health',
      frequency: [0, 2, 4, 6], // Sunday, Tuesday, Thursday, Saturday
      completed: true,
      notes: '30 minutes strength training',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Journal Writing',
      category: 'personal',
      frequency: [0, 1, 2, 3, 4, 5, 6], // Every day
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Call a Friend',
      category: 'social',
      frequency: [0, 3], // Sunday, Wednesday
      completed: false,
      notes: 'Catch up with old friends',
      createdAt: new Date().toISOString(),
    },
  ];
}