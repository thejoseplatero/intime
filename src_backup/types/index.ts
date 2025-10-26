export type MilestoneCategory = 'Personal' | 'Relationship' | 'Work' | 'Travel' | 'Goal';

export interface Milestone {
  id: string;
  title: string;
  date: string; // ISO date string
  emoji: string;
  category?: MilestoneCategory;
  note?: string;
  createdAt: string;
}
