import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Milestone } from '../types';
import { calculateDaysLeft, getDaysLeftText, getCategoryColor } from '../utils/dateHelpers';
import { ProgressRing } from '../components/ProgressRing';

interface MilestoneCardProps {
  milestone: Milestone;
  onPress: () => void;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  onPress,
}) => {
  const daysLeft = calculateDaysLeft(milestone.date);
  const colors = getCategoryColor(milestone.category);
  const progress = Math.max(0, Math.min(1, 1 - daysLeft / 365));

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.secondary }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={styles.emoji}>{milestone.emoji}</Text>
        </View>
        <View style={styles.middleSection}>
          <Text style={styles.title}>{milestone.title}</Text>
          <Text style={styles.days}>{getDaysLeftText(daysLeft)}</Text>
        </View>
        <View style={styles.rightSection}>
          <ProgressRing
            progress={progress}
            size={48}
            strokeWidth={4}
            color={colors.primary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSection: {
    marginRight: 16,
  },
  emoji: {
    fontSize: 32,
  },
  middleSection: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  days: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  rightSection: {
    marginLeft: 16,
  },
});
