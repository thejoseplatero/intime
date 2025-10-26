import React, { useState, useEffect } from 'react';
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
    try {
      await storage.createBirthdayMilestoneIfNeeded();
      const data = await storage.loadMilestones();
      
      // Safety check: ensure data is an array
      if (!Array.isArray(data)) {
        console.error('loadMilestones: data is not an array', data);
        setMilestones([]);
        return;
      }
      
      // Separate birthday milestone from others
      const birthdayMilestone = data.find(m => m.id === 'birthday-milestone');
      const otherMilestones = data.filter(m => m.id !== 'birthday-milestone');
      
      // Sort other milestones by days remaining
      const sortedOthers = otherMilestones.sort((a, b) => {
        const daysA = calculateDaysLeft(a.date);
        const daysB = calculateDaysLeft(b.date);
        return daysA - daysB;
      });
      
      // Birthday first, then others
      setMilestones(birthdayMilestone ? [birthdayMilestone, ...sortedOthers] : sortedOthers);
    } catch (error) {
      console.error('Error in loadMilestones:', error);
      setMilestones([]);
    }
  };

  useEffect(() => {
    loadMilestones();
    const unsubscribe = navigation.addListener('focus', () => {
      loadMilestones();
    });
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [navigation]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMilestones();
    setRefreshing(false);
  };

  const handleMilestoneEdit = (milestone: Milestone) => {
    navigation.navigate('AddMilestone', { milestone });
  };

  const handleMilestoneDelete = async (milestone: Milestone) => {
    const allMilestones = await storage.loadMilestones();
    const updated = allMilestones.filter((m) => m.id !== milestone.id);
    await storage.saveMilestones(updated);
    loadMilestones();
  };

  const renderMilestone = ({ item }: { item: Milestone }) => (
    <MilestoneCard
      milestone={item}
      onEdit={() => handleMilestoneEdit(item)}
      onDelete={() => handleMilestoneDelete(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⏱ InTime</Text>
        <Text style={styles.headerSubtitle}>
          Every moment is precious. Use it wisely.
        </Text>
      </View>

      {milestones.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>✨</Text>
          <Text style={styles.emptyTitle}>Time to begin</Text>
          <Text style={styles.emptyDescription}>
            Add what matters to you and watch how much time you have left
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
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '300',
    color: '#2C2C2C',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#9E9E9E',
    fontWeight: '400',
  },
  list: {
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  emptyEmoji: {
    fontSize: 96,
    marginBottom: 32,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#424242',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  emptyDescription: {
    fontSize: 17,
    color: '#9E9E9E',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '400',
    lineHeight: 26,
  },
  addButton: {
    backgroundColor: '#FF9F80',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 32,
    shadowColor: '#FF9F80',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF9F80',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF9F80',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '300',
    lineHeight: 32,
  },
});
