import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  interpolate,
  Extrapolation 
} from 'react-native-reanimated';
import { Milestone } from '../types';
import { LiveCountdown } from '../components/LiveCountdown';
import { storage } from '../utils/storage';

interface MilestoneCardProps {
  milestone: Milestone;
  onEdit: () => void;
  onDelete: () => void;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  onEdit,
  onDelete,
}) => {
  const isBirthday = milestone.id === 'birthday-milestone';
  const [expanded, setExpanded] = useState(false);
  const [nextAge, setNextAge] = useState<number | null>(null);
  const [currentAge, setCurrentAge] = useState<number>(0);

  // Animation values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isBirthday) {
      loadAge();
    }
    // Stagger entry animation
    opacity.value = withTiming(1, { duration: 600 });
  }, [isBirthday]);

  useEffect(() => {
    // Animate expand/collapse with spring physics
    progress.value = withSpring(expanded ? 1 : 0, {
      damping: 20,
      stiffness: 120,
    });
    rotation.value = withTiming(expanded ? 180 : 0, { duration: 300 });
  }, [expanded]);

  const loadAge = async () => {
    const birthday = await storage.getBirthday();
    if (birthday) {
      const today = new Date();
      const birth = new Date(birthday);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      setCurrentAge(age);
      setNextAge(age + 1);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Milestone',
      `Are you sure you want to delete "${milestone.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: onDelete, style: 'destructive' },
      ]
    );
  };

  const handlePress = () => {
    // Magnetic pulse animation
    scale.value = withSpring(0.97, { damping: 15 }, () => {
      scale.value = withSpring(1);
    });
    setExpanded(!expanded);
  };

  // Animated styles
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    marginTop: interpolate(
      opacity.value,
      [0, 1],
      [-20, 0],
      Extrapolation.CLAMP
    ),
  }));

  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    height: interpolate(
      progress.value,
      [0, 1],
      [0, 400],
      Extrapolation.CLAMP
    ),
    marginTop: interpolate(
      progress.value,
      [0, 1],
      [0, 16],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <Animated.View style={cardAnimatedStyle}>
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.95}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>{milestone.emoji}</Text>
          <View style={styles.titleContainer}>
            {isBirthday && nextAge ? (
              <Text style={styles.title}>You will be {nextAge} in</Text>
            ) : (
              <Text style={styles.title}>{milestone.title}</Text>
            )}
          </View>
          <Animated.View style={chevronAnimatedStyle}>
            <Text style={styles.chevron}>▼</Text>
          </Animated.View>
        </View>

      <View style={styles.countdownPreview}>
        <LiveCountdown targetDate={milestone.date} showFullDetails={false} />
      </View>

      <Animated.View style={contentAnimatedStyle}>
        {progress.value > 0 && (
          <View style={styles.expandedContent}>
          {isBirthday && currentAge > 0 ? (
            <View style={styles.birthdayInfo}>
              <Text style={styles.birthdayText}>You are {currentAge} years old now</Text>
              <Text style={styles.birthdayText}>Turning {nextAge} on your next birthday</Text>
            </View>
          ) : null}
          
          <View style={styles.countdownContainer}>
            <LiveCountdown 
              targetDate={milestone.date} 
              showFullDetails={true}
              isBirthday={false}
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={onEdit}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
        )}
      </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  chevron: {
    fontSize: 14,
    color: '#9E9E9E',
    marginLeft: 8,
  },
  countdownPreview: {
    marginTop: 8,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  birthdayInfo: {
    marginBottom: 16,
    alignItems: 'center',
  },
  birthdayText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  countdownContainer: {
    marginVertical: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  editButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#6C7CE7',
    marginRight: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#ff6b6b',
    marginLeft: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
