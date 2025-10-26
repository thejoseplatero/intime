import AsyncStorage from '@react-native-async-storage/async-storage';
import { Milestone } from '../types';

const MILESTONES_KEY = '@intime:milestones';
const ONBOARDING_KEY = '@intime:hasCompletedOnboarding';

export const storage = {
  async saveMilestones(milestones: Milestone[]): Promise<void> {
    try {
      // Validate milestones array
      if (!Array.isArray(milestones)) {
        console.error('saveMilestones: not an array', milestones);
        return;
      }
      await AsyncStorage.setItem(MILESTONES_KEY, JSON.stringify(milestones));
    } catch (error) {
      console.error('Error saving milestones:', error);
    }
  },

  async loadMilestones(): Promise<Milestone[]> {
    try {
      const data = await AsyncStorage.getItem(MILESTONES_KEY);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      // Validate that parsed data is an array
      if (!Array.isArray(parsed)) return [];
      
      return parsed;
    } catch (error) {
      // Log error for debugging
      console.error('Error loading milestones:', error);
      return [];
    }
  },

  async hasCompletedOnboarding(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      return value === 'true';
    } catch (error) {
      return false;
    }
  },

  async setCompletedOnboarding(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      // Silently handle error
    }
  },

  async getBirthday(): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem('@intime:birthday');
      return value;
    } catch (error) {
      return null;
    }
  },

  async setBirthday(birthday: string): Promise<void> {
    try {
      await AsyncStorage.setItem('@intime:birthday', birthday);
    } catch (error) {
      // Silently handle error
    }
  },

  async createBirthdayMilestoneIfNeeded(): Promise<void> {
    try {
      const birthday = await this.getBirthday();
      if (!birthday) return;

      const milestones = await this.loadMilestones();
      const hasBirthdayMilestone = milestones.some(m => m.id === 'birthday-milestone');
      
      if (!hasBirthdayMilestone) {
        const today = new Date();
        const thisYear = today.getFullYear();
        const birthdayDate = new Date(birthday);
        const nextBirthday = new Date(thisYear, birthdayDate.getMonth(), birthdayDate.getDate());
        
        if (nextBirthday < today) {
          nextBirthday.setFullYear(thisYear + 1);
        }

        const birthdayMilestone: Milestone = {
          id: 'birthday-milestone',
          title: 'Next Birthday',
          date: nextBirthday.toISOString().split('T')[0],
          emoji: '🎂',
          category: 'Personal',
          note: 'Another year of life',
          createdAt: new Date().toISOString(),
        };

        milestones.unshift(birthdayMilestone);
        await this.saveMilestones(milestones);
      }
    } catch (error) {
      // Silently handle error - birthday milestone is optional
    }
  },
};
