import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Milestone } from '../types';
import { calculateDaysLeft, getCategoryColor } from '../utils/dateHelpers';
import { LiveCountdown } from '../components/LiveCountdown';
import { storage } from '../utils/storage';

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
  const isBirthday = milestone.id === 'birthday-milestone';
  const [nextAge, setNextAge] = useState<number | null>(null);

  useEffect(() => {
    if (isBirthday) {
      loadNextAge();
    }
  }, [isBirthday]);

  const loadNextAge = async () => {
    const birthday = await storage.getBirthday();
    if (birthday) {
      const today = new Date();
      const birth = new Date(birthday);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      setNextAge(age + 1);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.secondary }]}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={styles.emoji}>{milestone.emoji}</Text>
        </View>
        <View style={styles.middleSection}>
          {isBirthday && nextAge ? (
            <Text style={styles.birthdayText}>You will be {nextAge} in</Text>
          ) : (
            <Text style={styles.title}>{milestone.title}</Text>
          )}
          <LiveCountdown targetDate={milestone.date} showFullDetails={false} />
        </View>
        <View style={styles.rightSection}>
          <View style={[styles.circle, { borderColor: colors.primary }]}>
            <Text style={[styles.progressText, { color: colors.primary }]}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSection: {
    marginRight: 20,
  },
  emoji: {
    fontSize: 40,
    opacity: 0.9,
  },
  middleSection: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    color: '#2C2C2C',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  birthdayText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#2C2C2C',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  rightSection: {
    marginLeft: 16,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
