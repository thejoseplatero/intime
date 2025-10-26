import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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

  useEffect(() => {
    if (isBirthday) {
      loadAge();
    }
  }, [isBirthday]);

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

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setExpanded(!expanded)}
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
        <Text style={styles.chevron}>{expanded ? '▼' : '▶'}</Text>
      </View>

      <View style={styles.countdownPreview}>
        <LiveCountdown targetDate={milestone.date} showFullDetails={false} />
      </View>

      {expanded && (
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
    </TouchableOpacity>
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
    shadowOpacity: 0.04,
    shadowRadius: 12,
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
