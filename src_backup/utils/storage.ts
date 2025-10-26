import AsyncStorage from '@react-native-async-storage/async-storage';
import { Milestone } from '../types';

const MILESTONES_KEY = '@intime:milestones';
const ONBOARDING_KEY = '@intime:hasCompletedOnboarding';

export const storage = {
  async saveMilestones(milestones: Milestone[]): Promise<void> {
    try {
      await AsyncStorage.setItem(MILESTONES_KEY, JSON.stringify(milestones));
    } catch (error) {
      console.error('Error saving milestones:', error);
      throw error;
    }
  },

  async loadMilestones(): Promise<Milestone[]> {
    try {
      const data = await AsyncStorage.getItem(MILESTONES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
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
      console.error('Error setting onboarding status:', error);
    }
  },
};
