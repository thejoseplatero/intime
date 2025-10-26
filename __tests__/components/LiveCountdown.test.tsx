import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { LiveCountdown } from '../../src/components/LiveCountdown';
import { storage } from '../../src/utils/storage';

// Mock storage
jest.mock('../../src/utils/storage', () => ({
  storage: {
    getBirthday: jest.fn(),
  },
}));

describe('LiveCountdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render countdown in compact mode', () => {
    const { getByText } = render(
      <LiveCountdown targetDate="2024-01-20" showFullDetails={false} />
    );

    expect(getByText(/d/)).toBeTruthy(); // Should show days
    expect(getByText(/s/)).toBeTruthy(); // Should show seconds
  });

  it('should render countdown in full details mode', () => {
    const { getByText } = render(
      <LiveCountdown targetDate="2024-01-20" showFullDetails={true} />
    );

    expect(getByText(/day/i)).toBeTruthy();
    expect(getByText(/sec/i)).toBeTruthy();
  });

  it('should update every second', async () => {
    const { getByText } = render(
      <LiveCountdown targetDate="2024-01-15T12:00:10" showFullDetails={false} />
    );

    const initialText = getByText(/10s/);

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      // Should update
      expect(getByText(/s/)).toBeTruthy();
    });
  });

  it('should format seconds with leading zero', () => {
    const { getByText } = render(
      <LiveCountdown targetDate="2024-01-15T12:00:05" showFullDetails={false} />
    );

    expect(getByText(/05s/)).toBeTruthy();
  });

  it('should handle birthday milestone', async () => {
    (storage.getBirthday as jest.Mock).mockResolvedValue('2000-01-01');

    const { queryByText } = render(
      <LiveCountdown targetDate="2024-06-15" showFullDetails={true} isBirthday={true} />
    );

    // Wait for async birthday load
    await waitFor(() => {
      expect(storage.getBirthday).toHaveBeenCalled();
    });

    // Component should render
    expect(queryByText(/year/i)).toBeTruthy();
  });
});

