import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MoodContext } from '@/context/MoodContext';
import { Habit } from '@/types';
import { CircleCheck as CheckCircle2, Circle } from 'lucide-react-native';
import { useHabits } from '@/hooks/useHabits';
import { getCategoryDetails } from '@/utils/categoryHelpers';

interface HabitSummaryProps {
  habit: Habit;
}

export default function HabitSummary({ habit }: HabitSummaryProps) {
  const { theme } = useContext(MoodContext);
  const { toggleHabit } = useHabits();
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
      onPress={() => toggleHabit(habit.id)}
    >
      <View style={styles.leftContent}>
        {habit.completed ? (
          <CheckCircle2 size={24} color={theme.colors.success} />
        ) : (
          <Circle size={24} color={theme.colors.primary} />
        )}
      </View>
      
      <View style={styles.centerContent}>
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
        </View>
      </View>
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
  leftContent: {
    marginRight: 12,
  },
  centerContent: {
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
});