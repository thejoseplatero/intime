import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Milestone } from '../types';
import { storage } from '../utils/storage';

interface AddMilestoneScreenProps {
  navigation: any;
  route?: {
    params?: {
      milestone?: Milestone;
    };
  };
}

export const AddMilestoneScreen: React.FC<AddMilestoneScreenProps> = ({
  navigation,
  route,
}) => {
  const milestone = route?.params?.milestone;
  const isEditing = !!milestone;

  const [title, setTitle] = useState(milestone?.title || '');
  const [date, setDate] = useState(
    milestone ? new Date(milestone.date) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;

    const newMilestone: Milestone = {
      id: milestone?.id || Date.now().toString(),
      title: title.trim(),
      emoji: '🎯',
      date: date.toISOString(),
      category: undefined,
      createdAt: milestone?.createdAt || new Date().toISOString(),
    };

    const milestones = await storage.loadMilestones();
    
    if (isEditing) {
      const updated = milestones.map((m) =>
        m.id === newMilestone.id ? newMilestone : m
      );
      await storage.saveMilestones(updated);
    } else {
      await storage.saveMilestones([...milestones, newMilestone]);
    }

    navigation.goBack();
  };

  const formatDate = (d: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit' : 'Add'} Milestone
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="What are you counting down to?"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
            autoFocus
          />

          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {formatDate(date)}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (Platform.OS === 'android') {
                  setShowDatePicker(false);
                  if (event.type === 'set' && selectedDate) {
                    setDate(selectedDate);
                  }
                } else {
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }
              }}
              minimumDate={new Date()}
            />
          )}
          
          {Platform.OS === 'ios' && showDatePicker && (
            <View style={styles.iosButtonContainer}>
              <TouchableOpacity 
                style={styles.iosButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.iosButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6C7CE7',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  saveButton: {
    fontSize: 16,
    color: '#6C7CE7',
    fontWeight: '600',
  },
  saveButtonDisabled: {
    color: '#cccccc',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    borderBottomWidth: 2,
    borderBottomColor: '#6C7CE7',
    paddingVertical: 12,
    marginBottom: 32,
  },
  dateButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  dateButtonText: {
    fontSize: 18,
    color: '#1a1a1a',
    fontWeight: '500',
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
});
