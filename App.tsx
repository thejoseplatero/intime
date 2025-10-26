import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { storage } from './src/utils/storage';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { MilestoneDetailScreen } from './src/screens/MilestoneDetailScreen';
import { AddMilestoneScreen } from './src/screens/AddMilestoneScreen';

// Disable LogBox to skip PNG errors
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

// Simple navigation state
type Screen = 'loading' | 'onboarding' | 'dashboard' | 'detail' | 'add' | 'settings';
type MilestoneId = string;

function App() {
  const [hasCompletedOnboarding, setHasCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>('loading');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<MilestoneId | null>(null);
  const [milestones, setMilestones] = useState<any[]>([]);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (hasCompletedOnboarding && currentScreen === 'dashboard') {
      loadMilestones();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen, hasCompletedOnboarding]);

  const checkOnboardingStatus = async () => {
    const completed = await storage.hasCompletedOnboarding();
    setHasCompleted(completed);
    setIsLoading(false);
  };

  const handleOnboardingComplete = async () => {
    await storage.setCompletedOnboarding();
    setHasCompleted(true);
    setCurrentScreen('dashboard');
  };

  const loadMilestones = async () => {
    await storage.createBirthdayMilestoneIfNeeded();
    const data = await storage.loadMilestones();
    setMilestones(data);
  };

  // Navigation helpers
  const navigation = React.useMemo(() => ({
    navigate: (screen: string, params?: any) => {
      if (screen === 'MilestoneDetail') {
        setCurrentScreen('detail');
        setSelectedMilestoneId(params?.milestoneId);
      } else if (screen === 'AddMilestone') {
        setCurrentScreen('add');
      } else if (screen === 'Settings') {
        setCurrentScreen('settings');
      } else if (screen === 'Dashboard') {
        setCurrentScreen('dashboard');
      }
    },
    addListener: (event: string, callback: () => void) => {
      // Return a no-op unsubscribe function
      return () => {};
    },
  }), []);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </>
    );
  }

  if (currentScreen === 'dashboard') {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <DashboardScreen navigation={navigation} />
      </>
    );
  }

  if (currentScreen === 'detail' && selectedMilestoneId) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <MilestoneDetailScreen 
          navigation={navigation} 
          route={{ params: { milestoneId: selectedMilestoneId } }}
        />
      </>
    );
  }

  if (currentScreen === 'add') {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <AddMilestoneScreen navigation={navigation} />
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <DashboardScreen navigation={navigation} />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default App;
