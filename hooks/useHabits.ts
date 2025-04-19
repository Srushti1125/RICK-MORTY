import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '@/types';
import { generateSampleHabits } from '@/utils/sampleData';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setIsLoading(true);
      const habitsData = await AsyncStorage.getItem('habits');
      
      if (habitsData) {
        setHabits(JSON.parse(habitsData));
      } else {
        // Load sample data for first-time users
        const sampleHabits = generateSampleHabits();
        setHabits(sampleHabits);
        await AsyncStorage.setItem('habits', JSON.stringify(sampleHabits));
      }
    } catch (error) {
      console.error('Failed to load habits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveHabits = async (updatedHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
    } catch (error) {
      console.error('Failed to save habits:', error);
    }
  };

  const addHabit = async (habit: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
    return newHabit;
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    const updatedHabits = habits.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    );
    
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  };

  const deleteHabit = async (id: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== id);
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  };

  const toggleHabit = async (id: string) => {
    const updatedHabits = habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  };

  const clearAllHabits = async () => {
    setHabits([]);
    await AsyncStorage.removeItem('habits');
  };

  // Filter habits for today
  const todaysHabits = habits.filter(habit => {
    const today = new Date().getDay();
    return habit.frequency.includes(today);
  });

  // Get completion counts
  const completedCount = habits.filter(habit => habit.completed).length;

  const getCompletionRate = (habitList = habits) => {
    if (habitList.length === 0) return 0;
    const completed = habitList.filter(habit => habit.completed).length;
    return Math.round((completed / habitList.length) * 100);
  };

  return {
    habits,
    todaysHabits,
    completedCount,
    isLoading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    clearAllHabits,
    getCompletionRate,
  };
}