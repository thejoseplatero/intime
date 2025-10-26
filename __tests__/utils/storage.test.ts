import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '../../src/utils/storage';
import { Milestone } from '../../src/types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('Storage utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveMilestones', () => {
    it('should save milestones correctly', async () => {
      const milestones: Milestone[] = [
        {
          id: '1',
          title: 'Test Milestone',
          date: '2025-12-31',
          emoji: '🎉',
          category: 'Personal',
          createdAt: new Date().toISOString(),
        },
      ];

      await storage.saveMilestones(milestones);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@intime:milestones',
        JSON.stringify(milestones)
      );
    });
  });

  describe('loadMilestones', () => {
    it('should load milestones from storage', async () => {
      const milestones: Milestone[] = [
        {
          id: '1',
          title: 'Test Milestone',
          date: '2025-12-31',
          emoji: '🎉',
          category: 'Personal',
          createdAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(milestones));

      const result = await storage.loadMilestones();

      expect(result).toEqual(milestones);
    });

    it('should return empty array when no data exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await storage.loadMilestones();

      expect(result).toEqual([]);
    });
  });

  describe('onboarding status', () => {
    it('should check if user has completed onboarding', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');

      const result = await storage.hasCompletedOnboarding();

      expect(result).toBe(true);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@intime:hasCompletedOnboarding');
    });

    it('should return false when onboarding not completed', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await storage.hasCompletedOnboarding();

      expect(result).toBe(false);
    });

    it('should set onboarding as completed', async () => {
      await storage.setCompletedOnboarding();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@intime:hasCompletedOnboarding', 'true');
    });
  });

  describe('birthday management', () => {
    it('should get birthday from storage', async () => {
      const birthday = '1990-01-01';
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(birthday);

      const result = await storage.getBirthday();

      expect(result).toBe(birthday);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@intime:birthday');
    });

    it('should set birthday in storage', async () => {
      const birthday = '1990-01-01';

      await storage.setBirthday(birthday);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@intime:birthday', birthday);
    });

    it('should create birthday milestone when needed', async () => {
      const birthday = '1990-06-15';
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@intime:birthday') return Promise.resolve(birthday);
        if (key === '@intime:milestones') return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      await storage.createBirthdayMilestoneIfNeeded();

      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});

