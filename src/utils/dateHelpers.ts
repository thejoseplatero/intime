export const calculateDaysLeft = (targetDate: string): number => {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
};

export interface TimeRemaining {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number; // total milliseconds remaining
}

export const calculateTimeRemaining = (targetDate: string): TimeRemaining => {
  const now = new Date();
  const target = new Date(targetDate);
  let diff = target.getTime() - now.getTime();
  
  if (diff < 0) {
    return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  diff -= years * (1000 * 60 * 60 * 24 * 365);
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);
  
  const seconds = Math.floor(diff / 1000);
  
  return {
    years,
    days,
    hours,
    minutes,
    seconds,
    total: target.getTime() - now.getTime(),
  };
};

export const getDaysLeftText = (daysLeft: number): string => {
  if (daysLeft < 0) return 'Passed';
  if (daysLeft === 0) return 'Today';
  if (daysLeft === 1) return 'Tomorrow';
  if (daysLeft < 7) return `${daysLeft} days left`;
  if (daysLeft < 30) {
    const weeks = Math.floor(daysLeft / 7);
    const extraDays = daysLeft % 7;
    return extraDays > 0 ? `${weeks} week${weeks > 1 ? 's' : ''}, ${extraDays} day${extraDays > 1 ? 's' : ''} left` : `${weeks} week${weeks > 1 ? 's' : ''} left`;
  }
  if (daysLeft < 365) {
    const months = Math.floor(daysLeft / 30);
    return `${months} month${months > 1 ? 's' : ''} left`;
  }
  const years = Math.floor(daysLeft / 365);
  return `${years} year${years > 1 ? 's' : ''} left`;
};

export const getProgressPercentage = (targetDate: string, totalDuration: number): number => {
  const daysLeft = calculateDaysLeft(targetDate);
  if (daysLeft <= 0) return 1;
  const progress = (totalDuration - daysLeft) / totalDuration;
  return Math.min(Math.max(progress, 0), 1);
};

export const getCategoryColor = (category?: string): { primary: string; secondary: string } => {
  // Inspired by Headspace's calm, breathing color palette
  const colors = {
    Personal: { primary: '#EF9A9A', secondary: '#FFF3E0' }, // Soft coral
    Relationship: { primary: '#81C784', secondary: '#E8F5E9' }, // Mint green
    Work: { primary: '#90CAF9', secondary: '#E3F2FD' }, // Sky blue
    Travel: { primary: '#FFB74D', secondary: '#FFF8E1' }, // Warm amber
    Goal: { primary: '#CE93D8', secondary: '#F3E5F5' }, // Lavender
  };
  return colors[category as keyof typeof colors] || { primary: '#9E9E9E', secondary: '#F5F5F5' };
};
