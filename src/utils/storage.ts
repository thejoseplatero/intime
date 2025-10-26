import AsyncStorage from '@react-native-async-storage/async-storage';
import { Milestone } from '../types';

const MILESTONES_KEY = '@intime:milestones';
const ONBOARDING_KEY = '@intime:hasCompletedOnboarding';

export const storage = {
  async saveMilestones(milestones: Milestone[]): Promise<void> {
    try {
      await AsyncStorage.setItem(MILESTONES_KEY, JSON.stringify(milestones));
    } catch (error) {
      // Silently handle error - data is optional and shouldn't crash the app
      throw error;
    }
  },

  async loadMilestones(): Promise<Milestone[]> {
    try {
      const data = await AsyncStorage.getItem(MILESTONES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      // Silently handle error - return empty array on failure
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
