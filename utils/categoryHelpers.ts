import { categories } from '@/constants/Categories';
import { CategoryInfo } from '@/types';

const categoryColors: Record<string, string> = {
  health: '#4CAF50',    // Green
  work: '#2196F3',      // Blue
  personal: '#9C27B0',  // Purple
  education: '#FF9800', // Orange
  social: '#E91E63',    // Pink
  creative: '#00BCD4',  // Cyan
  finance: '#607D8B',   // Blue Grey
};

export function getCategoryDetails(categoryValue: string): CategoryInfo {
  const category = categories.find(c => c.value === categoryValue);
  const label = category?.label || 'Other';
  const color = categoryColors[categoryValue] || '#757575';
  
  return { label, color };
}