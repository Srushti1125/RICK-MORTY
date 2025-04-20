// Get current date in YYYY-MM-DD format
export const getCurrentDate = (): string => {
  const date = new Date();
  return formatDate(date);
};

// Format date to YYYY-MM-DD
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

// Parse YYYY-MM-DD date string to Date object
export const parseDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Get array of dates between two dates (inclusive)
export const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

// Check if date is today
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Calculate streak based on progress data
export const getDaysInStreak = (progress: { [date: string]: string[] }): number => {
  // Get all dates with progress
  const progressDates = Object.keys(progress)
    .map(dateStr => parseDate(dateStr))
    .filter(date => progress[formatDate(date)].length > 0)
    .sort((a, b) => b.getTime() - a.getTime()); // Sort in descending order
  
  if (progressDates.length === 0) return 0;
  
  // Check if most recent date is today or yesterday
  const mostRecentDate = progressDates[0];
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const mostRecentIsToday = isToday(mostRecentDate);
  const mostRecentIsYesterday = 
    mostRecentDate.getDate() === yesterday.getDate() &&
    mostRecentDate.getMonth() === yesterday.getMonth() &&
    mostRecentDate.getFullYear() === yesterday.getFullYear();
  
  // If most recent date is not today or yesterday, streak is broken
  if (!mostRecentIsToday && !mostRecentIsYesterday) return 0;
  
  // Count consecutive days
  let streak = 1; // Start with 1 for most recent day
  let currentDate = new Date(mostRecentDate);
  currentDate.setDate(currentDate.getDate() - 1);
  
  while (true) {
    const dateString = formatDate(currentDate);
    const hasProgress = progress[dateString] && progress[dateString].length > 0;
    
    if (!hasProgress) break;
    
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
};