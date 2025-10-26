export const calculateDaysLeft = (targetDate: string): number => {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
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
  const colors = {
    Personal: { primary: '#FF6B6B', secondary: '#FFE5E5' },
    Relationship: { primary: '#4ECDC4', secondary: '#E5FFFE' },
    Work: { primary: '#95E1D3', secondary: '#E5FFFA' },
    Travel: { primary: '#F38181', secondary: '#FFE5E5' },
    Goal: { primary: '#AA96DA', secondary: '#F0E8FF' },
  };
  return colors[category as keyof typeof colors] || { primary: '#6C7CE7', secondary: '#E5E8FF' };
};
