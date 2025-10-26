import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { DashboardScreen } from '../../src/screens/DashboardScreen';
import { storage } from '../../src/utils/storage';

// Mock storage
jest.mock('../../src/utils/storage', () => ({
  storage: {
    loadMilestones: jest.fn(),
    createBirthdayMilestoneIfNeeded: jest.fn(),
  },
}));

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
};

// Mock MilestoneCard
jest.mock('../../src/screens/MilestoneCard', () => ({
  MilestoneCard: ({ milestone }: { milestone: any }) => (
    <div testID="milestone-card">{milestone.title}</div>
  ),
}));

describe('DashboardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when no milestones', async () => {
    (storage.loadMilestones as jest.Mock).mockResolvedValue([]);

    const { getByText } = render(<DashboardScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('Time to begin')).toBeTruthy();
      expect(getByText('Add what matters to you and watch how much time you have left')).toBeTruthy();
    });
  });

  it('should render milestones when they exist', async () => {
    const milestones = [
      {
        id: '1',
        title: 'Test Milestone',
        date: '2025-12-31',
        emoji: '🎉',
        createdAt: new Date().toISOString(),
      },
    ];

    (storage.loadMilestones as jest.Mock).mockResolvedValue(milestones);

    const { getByTestId } = render(<DashboardScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByTestId('milestone-card')).toBeTruthy();
    });
  });

  it('should call loadMilestones on mount', async () => {
    (storage.loadMilestones as jest.Mock).mockResolvedValue([]);

    render(<DashboardScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(storage.createBirthdayMilestoneIfNeeded).toHaveBeenCalled();
      expect(storage.loadMilestones).toHaveBeenCalled();
    });
  });

  it('should display milestone count in subtitle', async () => {
    const milestones = [
      {
        id: '1',
        title: 'Milestone 1',
        date: '2025-12-31',
        emoji: '🎉',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Milestone 2',
        date: '2026-01-01',
        emoji: '🎂',
        createdAt: new Date().toISOString(),
      },
    ];

    (storage.loadMilestones as jest.Mock).mockResolvedValue(milestones);

    const { getByText } = render(<DashboardScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('2 milestones')).toBeTruthy();
    });
  });
});

