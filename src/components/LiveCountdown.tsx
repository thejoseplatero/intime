import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateTimeRemaining, TimeRemaining } from '../utils/dateHelpers';
import { storage } from '../utils/storage';

interface LiveCountdownProps {
  targetDate: string;
  showFullDetails?: boolean;
  isBirthday?: boolean;
}

export const LiveCountdown: React.FC<LiveCountdownProps> = ({
  targetDate,
  showFullDetails = true,
  isBirthday = false,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    calculateTimeRemaining(targetDate)
  );
  const [age, setAge] = useState<number>(0);

  useEffect(() => {
    const updateAge = async () => {
      if (isBirthday) {
        const birthday = await storage.getBirthday();
        if (birthday) {
          const today = new Date();
          const birth = new Date(birthday);
          let ageCalc = today.getFullYear() - birth.getFullYear();
          const monthDiff = today.getMonth() - birth.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            ageCalc--;
          }
          setAge(ageCalc);
        }
      }
    };
    
    updateAge();
    
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, isBirthday]);

  const { years, days, hours, minutes, seconds, total } = timeRemaining;
  const isPast = total <= 0;

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  // Celebration screen when milestone is reached - Duolingo-style delight!
  if (isPast) {
    return (
      <View style={styles.celebrationContainer}>
        <Text style={styles.celebrationEmojiRow}>🎉 🎊 ✨ 🎈 🎁</Text>
        <Text style={styles.celebrationTitle}>You made it!</Text>
        <Text style={styles.celebrationMessage}>This moment has arrived</Text>
        <Text style={styles.celebrationSubMessage}>✨ Congratulations ✨</Text>
      </View>
    );
  }

  if (showFullDetails) {
    return (
      <View style={styles.container}>
        {isBirthday && age > 0 && (
          <View style={styles.ageContainer}>
            <Text style={styles.ageNumber}>{age}</Text>
            <Text style={styles.ageLabel}>years old</Text>
          </View>
        )}
        <View style={styles.row}>
          {years > 0 && (
            <View style={styles.timeBlock}>
              <Text style={styles.number}>{years}</Text>
              <Text style={styles.label}>year{years !== 1 ? 's' : ''}</Text>
            </View>
          )}
          {days > 0 && (
            <View style={styles.timeBlock}>
              <Text style={styles.number}>{formatNumber(days)}</Text>
              <Text style={styles.label}>day{days !== 1 ? 's' : ''}</Text>
            </View>
          )}
          {hours > 0 && (
            <View style={styles.timeBlock}>
              <Text style={styles.number}>{formatNumber(hours)}</Text>
              <Text style={styles.label}>hour{hours !== 1 ? 's' : ''}</Text>
            </View>
          )}
          {minutes > 0 && (
            <View style={styles.timeBlock}>
              <Text style={styles.number}>{formatNumber(minutes)}</Text>
              <Text style={styles.label}>min{minutes !== 1 ? 's' : ''}</Text>
            </View>
          )}
          <View style={styles.timeBlock}>
            <Text style={styles.number}>{formatNumber(seconds)}</Text>
            <Text style={styles.label}>sec{seconds !== 1 ? 's' : ''}</Text>
          </View>
        </View>
      </View>
    );
  }

  // Simplified version for cards
  const parts = [];
  if (years > 0) parts.push(`${years}y`);
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${formatNumber(minutes)}m`);
  parts.push(`${formatNumber(seconds)}s`);
  
  return (
    <View style={styles.compactContainer}>
      <Text style={styles.compactText}>{parts.join(' ')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  },
  timeBlock: {
    alignItems: 'center',
    flex: 1,
  },
  number: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  ageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  ageNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  ageLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  celebrationContainer: {
    alignItems: 'center',
    padding: 20,
  },
  celebrationEmojiRow: {
    fontSize: 52,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 8,
  },
  celebrationTitle: {
    fontSize: 44,
    fontWeight: '800',
    color: '#FF6B9D',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  celebrationMessage: {
    fontSize: 22,
    color: '#FF9F80',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  celebrationSubMessage: {
    fontSize: 18,
    color: '#81C784',
    textAlign: 'center',
    fontWeight: '500',
  },
});

