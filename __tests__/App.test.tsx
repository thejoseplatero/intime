/**
 * @format
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

// Mock navigation and storage
jest.mock('../src/utils/storage', () => ({
  storage: {
    hasCompletedOnboarding: jest.fn().mockResolvedValue(true),
    loadMilestones: jest.fn().mockResolvedValue([]),
    createBirthdayMilestoneIfNeeded: jest.fn(),
  },
}));

test('renders correctly', async () => {
  const { findByText } = render(<App />);
  
  // Should show dashboard after loading completes
  const dashboard = await findByText('InTime', {}, { timeout: 3000 });
  expect(dashboard).toBeTruthy();
});
