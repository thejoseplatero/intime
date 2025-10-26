import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Milestone } from '../types';
import { storage } from '../utils/storage';
import { MilestoneCard } from './MilestoneCard';
import { calculateDaysLeft } from '../utils/dateHelpers';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadMilestones = async () => {
    const data = await storage.loadMilestones();
    // Sort by days left (ascending)
    const sorted = data.sort((a, b) => {
      const daysA = calculateDaysLeft(a.date);
      const daysB = calculateDaysLeft(b.date);
      return daysA - daysB;
    });
    setMilestones(sorted);
  };

  useEffect(() => {
    loadMilestones();
    
    // Refresh when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadMilestones();
    });

    return unsubscribe;
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMilestones();
    setRefreshing(false);
  }, []);

  const renderMilestone = ({ item }: { item: Milestone }) => (
    <MilestoneCard
      milestone={item}
      onPress={() => navigation.navigate('MilestoneDetail', { milestoneId: item.id })}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>InTime</Text>
        <Text style={styles.headerSubtitle}>
          {milestones.length === 0
            ? 'No milestones yet'
            : `${milestones.length} milestone${milestones.length > 1 ? 's' : ''}`}
        </Text>
      </View>

      {milestones.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>⏱️</Text>
          <Text style={styles.emptyTitle}>No milestones yet</Text>
          <Text style={styles.emptyDescription}>
            Add your first milestone to start tracking
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddMilestone')}
          >
            <Text style={styles.addButtonText}>+ Add Milestone</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={milestones}
            renderItem={renderMilestone}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('AddMilestone')}
          >
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7a7a7a',
  },
  list: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#7a7a7a',
    textAlign: 'center',
    marginBottom: 32,
  },
  addButton: {
    backgroundColor: '#6C7CE7',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C7CE7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C7CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },
});
