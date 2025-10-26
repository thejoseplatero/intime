import { calculateDaysLeft, calculateTimeRemaining, TimeRemaining } from '../../src/utils/dateHelpers';

describe('Date helpers', () => {
  beforeEach(() => {
    // Mock current date to a fixed date for consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('calculateDaysLeft', () => {
    it('should calculate days correctly for future dates', () => {
      const targetDate = '2024-01-20';
      const result = calculateDaysLeft(targetDate);
      expect(result).toBe(5);
    });

    it('should return 0 for today', () => {
      const targetDate = '2024-01-15';
      const result = calculateDaysLeft(targetDate);
      expect(result).toBe(0);
    });

    it('should return negative for past dates', () => {
      const targetDate = '2024-01-10';
      const result = calculateDaysLeft(targetDate);
      expect(result).toBeLessThan(0);
    });
  });

  describe('calculateTimeRemaining', () => {
    it('should calculate complete time breakdown', () => {
      const targetDate = '2025-01-15';
      const result = calculateTimeRemaining(targetDate);

      expect(result).toHaveProperty('years');
      expect(result).toHaveProperty('days');
      expect(result).toHaveProperty('hours');
      expect(result).toHaveProperty('minutes');
      expect(result).toHaveProperty('seconds');
      expect(result).toHaveProperty('total');
      expect(result.total).toBeGreaterThan(0);
    });

    it('should return zeros for past dates', () => {
      const targetDate = '2023-01-01';
      const result = calculateTimeRemaining(targetDate);

      expect(result.years).toBe(0);
      expect(result.days).toBe(0);
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
      expect(result.total).toBe(0);
    });

    it('should calculate years correctly', () => {
      const targetDate = '2026-01-15';
      const result = calculateTimeRemaining(targetDate);
      expect(result.years).toBeGreaterThan(0);
    });
  });
});

