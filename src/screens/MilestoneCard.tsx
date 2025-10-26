import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Milestone } from '../types';
import { getCategoryColor } from '../utils/dateHelpers';
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
  const colors = getCategoryColor(milestone.category);
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
});
