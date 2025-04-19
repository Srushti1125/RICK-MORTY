export interface Habit {
  id: string;
  title: string;
  category: string;
  frequency: number[]; // Days of week (0 = Sunday, 6 = Saturday)
  completed: boolean;
  notes?: string;
  createdAt: string;
}

export interface CategoryInfo {
  label: string;
  color: string;
}