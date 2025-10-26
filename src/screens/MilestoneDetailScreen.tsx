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
import { LiveCountdown } from '../components/LiveCountdown';
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
  const [currentAge, setCurrentAge] = useState<number>(0);
  const [nextAge, setNextAge] = useState<number>(0);
  const isBirthday = milestoneId === 'birthday-milestone';

  useEffect(() => {
    loadMilestone();
    if (isBirthday) {
      calculateAges();
    }
  }, []);

  const calculateAges = async () => {
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

  // Encouraging, honest microcopy inspired by Wise
  const getMotivationalText = (days: number) => {
    if (days < 0) return { main: "You made it!", sub: "This moment has arrived" };
    if (days === 0) return { main: "Today is the day", sub: "Make it count" };
    if (days === 1) return { main: "Tomorrow!", sub: "One more day to make a difference" };
    if (days <= 7) return { main: `${days} days left`, sub: "Every moment counts" };
    if (days <= 30) return { main: `${Math.floor(days / 7)} weeks away`, sub: "Plenty of time to prepare" };
    return { main: `${Math.floor(days / 30)} months away`, sub: "Take it one day at a time" };
  };

  const motivation = getMotivationalText(daysLeft);

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
          
          {isBirthday && currentAge > 0 ? (
            <View style={styles.birthdaySpecialContainer}>
              <Text style={styles.birthdayMainText}>You are {currentAge} years old now</Text>
              <Text style={styles.birthdaySubText}>and you will be {nextAge} years old</Text>
              
              <View style={styles.birthdayCountdown}>
                <Text style={styles.birthdayCountdownLabel}>in</Text>
                <LiveCountdown 
                  targetDate={milestone.date} 
                  showFullDetails={true}
                  isBirthday={false}
                />
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.title}>{milestone.title}</Text>
              
              <View style={styles.countdownContainer}>
                <LiveCountdown 
                  targetDate={milestone.date} 
                  showFullDetails={true}
                  isBirthday={false}
                />
              </View>
            </>
          )}

          <Text style={styles.motivationalTitle}>{motivation.main}</Text>
          <Text style={styles.motivationalSub}>{motivation.sub}</Text>

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
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  birthdaySpecialContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  birthdayMainText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 44,
  },
  birthdaySubText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 24,
  },
  birthdayCountdown: {
    width: '100%',
    alignItems: 'center',
  },
  birthdayCountdownLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  daysText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  motivationalTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#424242',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  motivationalSub: {
    fontSize: 17,
    fontWeight: '400',
    color: '#757575',
    textAlign: 'center',
    marginBottom: 32,
    fontStyle: 'italic',
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
