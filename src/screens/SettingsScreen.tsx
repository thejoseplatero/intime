import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storage } from '../utils/storage';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [birthday, setBirthday] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadBirthday();
  }, []);

  const loadBirthday = async () => {
    const bday = await storage.getBirthday();
    if (bday) {
      setBirthday(bday);
    }
  };

  const handleSave = async () => {
    if (!birthday.trim()) {
      setMessage('Please enter a valid date (YYYY-MM-DD)');
      return;
    }

    try {
      await storage.setBirthday(birthday.trim());
      
      // Update or create birthday milestone
      const milestones = await storage.loadMilestones();
      const existing = milestones.find(m => m.id === 'birthday-milestone');
      
      if (existing) {
        // Update existing milestone
        const today = new Date();
        const thisYear = today.getFullYear();
        const birthdayDate = new Date(birthday);
        const nextBirthday = new Date(thisYear, birthdayDate.getMonth(), birthdayDate.getDate());
        
        if (nextBirthday < today) {
          nextBirthday.setFullYear(thisYear + 1);
        }

        const updated = milestones.map(m =>
          m.id === 'birthday-milestone'
            ? { ...m, date: nextBirthday.toISOString().split('T')[0] }
            : m
        );
        await storage.saveMilestones(updated);
      } else {
        // Create new milestone
        await storage.createBirthdayMilestoneIfNeeded();
      }

      setMessage('Birthday updated!');
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.error('Error saving birthday:', error);
      setMessage('Error saving birthday');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Birthday</Text>
        <Text style={styles.description}>
          Edit your birthday to keep track of how much time you have left
        </Text>

        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD (e.g., 1990-05-15)"
          placeholderTextColor="#999"
          value={birthday}
          onChangeText={setBirthday}
          autoCapitalize="none"
        />

        {message ? (
          <Text style={[styles.message, message.includes('updated') ? styles.success : styles.error]}>
            {message}
          </Text>
        ) : null}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Birthday</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    fontSize: 16,
    color: '#6C7CE7',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 24,
  },
  input: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  success: {
    color: '#4CAF50',
  },
  error: {
    color: '#F44336',
  },
  saveButton: {
    backgroundColor: '#6C7CE7',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#6C7CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

