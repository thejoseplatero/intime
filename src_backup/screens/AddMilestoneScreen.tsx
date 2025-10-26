import React, { useState, useEffect } from 'react';
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
import { Milestone, MilestoneCategory } from '../types';
import { storage } from '../utils/storage';

interface AddMilestoneScreenProps {
  navigation: any;
  route: {
    params?: {
      milestone?: Milestone;
    };
  };
}

const CATEGORIES: MilestoneCategory[] = ['Personal', 'Relationship', 'Work', 'Travel', 'Goal'];

const EMOJIS = [
  '🎂', '🎉', '🏆', '💼', '✈️', '❤️', '🎯', '📅',
  '🌟', '🏖️', '💍', '🎓', '🏡', '🎁', '🌍', '🚀',
];

export const AddMilestoneScreen: React.FC<AddMilestoneScreenProps> = ({
  navigation,
  route,
}) => {
  const milestone = route.params?.milestone;
  const isEditing = !!milestone;

  const [title, setTitle] = useState(milestone?.title || '');
  const [emoji, setEmoji] = useState(milestone?.emoji || EMOJIS[0]);
  const [category, setCategory] = useState<MilestoneCategory | undefined>(
    milestone?.category
  );
  const [note, setNote] = useState(milestone?.note || '');
  const [date, setDate] = useState(
    milestone ? new Date(milestone.date) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;

    const newMilestone: Milestone = {
      id: milestone?.id || Date.now().toString(),
      title: title.trim(),
      emoji,
      date: date.toISOString(),
      category,
      note: note.trim() || undefined,
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
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

        <View style={styles.content}>
          <View style={styles.emojiSelector}>
            <Text style={styles.emojiDisplay}>{emoji}</Text>
          </View>

          <TextInput
            style={styles.titleInput}
            placeholder="Milestone title"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
              minimumDate={new Date()}
            />
          )}

          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  category === cat && styles.categoryChipActive,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Note (optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Add a personal note..."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            maxLength={200}
          />
        </View>

        <View style={styles.emojiGrid}>
          <Text style={styles.emojiGridLabel}>Choose emoji</Text>
          <View style={styles.emojiRow}>
            {EMOJIS.slice(0, 8).map((em) => (
              <TouchableOpacity
                key={em}
                style={[styles.emojiOption, emoji === em && styles.emojiOptionActive]}
                onPress={() => setEmoji(em)}
              >
                <Text style={styles.emojiText}>{em}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.emojiRow}>
            {EMOJIS.slice(8).map((em) => (
              <TouchableOpacity
                key={em}
                style={[styles.emojiOption, emoji === em && styles.emojiOptionActive]}
                onPress={() => setEmoji(em)}
              >
                <Text style={styles.emojiText}>{em}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  scrollView: {
    flex: 1,
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
  content: {
    padding: 20,
  },
  emojiSelector: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emojiDisplay: {
    fontSize: 64,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    borderBottomWidth: 2,
    borderBottomColor: '#6C7CE7',
    paddingVertical: 12,
    marginBottom: 24,
  },
  dateButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChipActive: {
    backgroundColor: '#6C7CE7',
    borderColor: '#6C7CE7',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
    minHeight: 100,
    marginBottom: 32,
  },
  emojiGrid: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  emojiGridLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
  },
  emojiRow: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'space-around',
  },
  emojiOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiOptionActive: {
    borderColor: '#6C7CE7',
    backgroundColor: '#f0f0ff',
  },
  emojiText: {
    fontSize: 24,
  },
});
