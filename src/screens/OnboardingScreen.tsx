import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { storage } from '../utils/storage';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const { width, height } = Dimensions.get('window');

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
}) => {
  const [date, setDate] = useState(new Date(2000, 0, 1)); // Default to Jan 1, 2000
  const [showPicker, setShowPicker] = useState(false);

  const handleComplete = async () => {
    const dateStr = date.toISOString().split('T')[0];
    await storage.setBirthday(dateStr);
    await storage.createBirthdayMilestoneIfNeeded();
    onComplete();
  };

  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    
    if (Platform.OS === 'android') {
      setShowPicker(false);
      // On Android, if user taps outside, event.type is 'dismissed'
      if (event.type === 'set' && selectedDate) {
        setDate(selectedDate);
      }
    } else {
      // iOS keeps picker open until user confirms
      if (selectedDate) {
        setDate(selectedDate);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎂</Text>
        <Text style={styles.title}>Tell us your birthday</Text>
        <Text style={styles.subtitle}>
          We'll show you every day exactly how much time you have left.{'\n\n'}
          This is your personal countdown to remind you what matters.
        </Text>
        
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateButtonText}>{formatDate(date)}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChange}
            maximumDate={new Date()}
          />
        )}
        
        {Platform.OS === 'ios' && showPicker && (
          <View style={styles.iosButtonContainer}>
            <TouchableOpacity 
              style={styles.iosButton}
              onPress={() => setShowPicker(false)}
            >
              <Text style={styles.iosButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <Text style={styles.hint}>
          Your birthday will be a special milestone
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleComplete}>
          <Text style={styles.buttonText}>Continue</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#4a4a4a',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 28,
  },
  dateButton: {
    width: '70%',
    borderWidth: 2,
    borderColor: '#6C7CE7',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9ff',
  },
  dateButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#6C7CE7',
    textAlign: 'center',
  },
  iosButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  iosButton: {
    backgroundColor: '#6C7CE7',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  iosButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#6C7CE7',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    shadowColor: '#6C7CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
