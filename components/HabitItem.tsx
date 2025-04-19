import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MoodContext } from '@/context/MoodContext';
import { Habit } from '@/types';
import { Check, CircleCheck as CheckCircle2, Circle } from 'lucide-react-native';
import { getCategoryDetails } from '@/utils/categoryHelpers';

interface HabitItemProps {
  habit: Habit;
  onToggle: () => void;
}

export default function HabitItem({ habit, onToggle }: HabitItemProps) {
  const { theme } = useContext(MoodContext);
  const categoryDetails = getCategoryDetails(habit.category);

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.cardBackground,
          borderLeftColor: categoryDetails.color,
        }
      ]}
      onPress={onToggle}
    >
      <View style={styles.content}>
        <View>
          <Text 
            style={[
              styles.title, 
              { 
                color: theme.colors.text,
                textDecorationLine: habit.completed ? 'line-through' : 'none',
                opacity: habit.completed ? 0.7 : 1,
              }
            ]}
          >
            {habit.title}
          </Text>
          <View style={styles.detailsRow}>
            <View style={[styles.categoryTag, { backgroundColor: categoryDetails.color + '20' }]}>
              <Text style={[styles.categoryText, { color: categoryDetails.color }]}>
                {categoryDetails.label}
              </Text>
            </View>
            {habit.notes ? (
              <Text 
                style={[styles.notes, { color: theme.colors.secondaryText }]}
                numberOfLines={1}
              >
                {habit.notes}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.checkboxContainer} 
        onPress={onToggle}
      >
        {habit.completed ? (
          <CheckCircle2 size={24} color={theme.colors.success} />
        ) : (
          <Circle size={24} color={theme.colors.primary} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  notes: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  checkboxContainer: {
    marginLeft: 8,
  },
});