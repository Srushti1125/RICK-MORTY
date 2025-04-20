import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import { getCurrentDate } from '@/utils/dateUtils';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

export default function DailyProgress() {
  const { theme } = useTheme();
  const { appData } = useAppData();
  
  // Get today's habits and progress
  const todayDate = getCurrentDate();
  const todayProgress = appData.progress[todayDate] || [];
  const totalHabits = appData.habits.length;
  const completedHabits = todayProgress.length;
  
  // Calculate progress percentage
  const progressPercentage = totalHabits > 0 
    ? (completedHabits / totalHabits) * 100 
    : 0;
  
  const width = useSharedValue(0);
  
  React.useEffect(() => {
    // Animate progress bar
    width.value = withDelay(
      300,
      withTiming(progressPercentage, { 
        duration: 1000, 
        easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
      })
    );
  }, [progressPercentage]);
  
  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${width.value}%`,
    };
  });
  
  // Determine color based on progress
  let progressColor = theme.colors.primary;
  if (progressPercentage >= 100) {
    progressColor = theme.colors.success;
  } else if (progressPercentage >= 50) {
    progressColor = theme.colors.secondary;
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
          Today's Progress
        </Text>
        <Text style={[styles.counter, { color: theme.colors.secondaryText }]}>
          {completedHabits}/{totalHabits}
        </Text>
      </View>
      
      <View style={[styles.progressBar, { backgroundColor: theme.colors.card }]}>
        <Animated.View 
          style={[
            styles.progressFill, 
            { backgroundColor: progressColor },
            progressAnimatedStyle
          ]} 
        />
      </View>
      
      <Text style={[styles.percentage, { color: theme.colors.secondaryText }]}>
        {Math.round(progressPercentage)}% Complete
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  counter: {
    fontSize: 16,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  percentage: {
    fontSize: 14,
    textAlign: 'right',
    marginTop: 4,
  },
});