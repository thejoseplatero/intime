import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Milestone } from '../types';
import { storage } from '../utils/storage';
import { ProgressRing } from '../components/ProgressRing';
import { calculateDaysLeft, getDaysLeftText, getCategoryColor } from '../utils/dateHelpers';

interface MilestoneDetailScreenProps {
  navigation: any;
  route: {
    params: {
      milestoneId: string;
    };
  };
}

export const MilestoneDetailScreen: React.FC<MilestoneDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { milestoneId } = route.params;
  const [milestone, setMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    loadMilestone();
  }, []);

  const loadMilestone = async () => {
    const milestones = await storage.loadMilestones();
    const found = milestones.find((m) => m.id === milestoneId);
    setMilestone(found || null);
  };

  const handleEdit = () => {
    navigation.navigate('AddMilestone', { milestone });
  };

  const handleDelete = async () => {
    if (!milestone) return;
    
    const milestones = await storage.loadMilestones();
    const updated = milestones.filter((m) => m.id !== milestone.id);
    await storage.saveMilestones(updated);
    navigation.goBack();
  };

  if (!milestone) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const daysLeft = calculateDaysLeft(milestone.date);
  const colors = getCategoryColor(milestone.category);
  const progress = Math.max(0, Math.min(1, 1 - daysLeft / 365));

  const motivationalText = daysLeft > 0
    ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left — what matters most today?`
    : 'This moment has arrived.';

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.secondary }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.emoji}>{milestone.emoji}</Text>
          <Text style={styles.title}>{milestone.title}</Text>
          
          <View style={styles.progressContainer}>
            <ProgressRing
              progress={progress}
              size={150}
              strokeWidth={8}
              color={colors.primary}
            />
            <View style={styles.progressCenter}>
              <Text style={styles.daysText}>{getDaysLeftText(daysLeft)}</Text>
            </View>
          </View>

          <Text style={styles.motivationalText}>{motivationalText}</Text>

          {milestone.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{milestone.category}</Text>
            </View>
          )}

          {milestone.note && (
            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>{milestone.note}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    fontSize: 16,
    color: '#6C7CE7',
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#6C7CE7',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 40,
    textAlign: 'center',
  },
  progressContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  progressCenter: {
    position: 'absolute',
  },
  daysText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  motivationalText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
  },
  categoryBadge: {
    backgroundColor: '#6C7CE7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  noteContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 24,
  },
  noteText: {
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 24,
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
