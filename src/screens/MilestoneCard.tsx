import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Milestone } from '../types';
import { LiveCountdown } from '../components/LiveCountdown';

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
    <View style={[styles.card, isBirthday && styles.birthdayCard]}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.9}
      >
        {isBirthday && (
          <View style={styles.birthdayHeader}>
            <Text style={styles.birthdayLabel}>YOUR LIFELINE</Text>
          </View>
        )}
        <View style={styles.header}>
          <Text style={[styles.emoji, isBirthday && styles.birthdayEmoji]}>{milestone.emoji}</Text>
          <Text style={[styles.title, isBirthday && styles.birthdayTitle]}>{milestone.title}</Text>
          {!isBirthday && <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>}
        </View>

        <View style={styles.countdownPreview}>
          <LiveCountdown targetDate={milestone.date} showFullDetails={false} />
        </View>

        {expanded && (
          <View style={styles.expandedContent}>
            <View style={styles.countdownContainer}>
              <LiveCountdown targetDate={milestone.date} showFullDetails={true} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
  },
  birthdayCard: {
    backgroundColor: '#FFF8F0',
    borderWidth: 3,
    borderColor: '#FF8C42',
    marginBottom: 32,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  birthdayHeader: {
    marginBottom: 12,
  },
  birthdayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6B35',
    letterSpacing: 1.5,
  },
  birthdayEmoji: {
    fontSize: 56,
    marginRight: 20,
  },
  birthdayTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2C1810',
    letterSpacing: -0.5,
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
  title: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: '#0E1116',
  },
  chevron: {
    fontSize: 12,
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
    borderTopColor: 'rgba(0,0,0,0.12)',
  },
  countdownContainer: {
    marginVertical: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    gap: 8,
  },
  editButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#DC2626',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
