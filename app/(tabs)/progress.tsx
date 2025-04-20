import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import { useState, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Download } from 'lucide-react-native';
import ProgressCalendar from '@/components/ProgressCalendar';
import StreakCounter from '@/components/StreakCounter';
import { getDatesBetween, formatDate } from '@/utils/dateUtils';

export default function ProgressScreen() {
  const { theme } = useTheme();
  const { appData } = useAppData();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week');
  
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  
  useEffect(() => {
    // Animate elements when screen loads
    opacity.value = withTiming(1, { duration: 500, easing: Easing.ease });
    translateY.value = withTiming(0, { duration: 500, easing: Easing.ease });
  }, []);
  
  const animatedViewStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });
  
  // Calculate completion rate for habits
  const calculateCompletionRate = () => {
    const today = new Date();
    let startDate: Date;
    
    switch (selectedTimeframe) {
      case 'week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
    }
    
    const dateRange = getDatesBetween(startDate, today);
    const totalDays = dateRange.length;
    
    // Count habits completed per day
    let totalCompletionsCount = 0;
    dateRange.forEach(date => {
      const dateString = formatDate(date);
      const completionsForDate = appData.progress[dateString] || [];
      totalCompletionsCount += completionsForDate.length;
    });
    
    // Calculate completion rate
    const availableHabits = appData.habits.length * totalDays;
    const completionRate = availableHabits > 0 
      ? Math.round((totalCompletionsCount / availableHabits) * 100) 
      : 0;
    
    return completionRate;
  };
  
  const exportProgressReport = async () => {
    try {
      // Create a report in CSV format
      let csvContent = "Date,Habit,Completed\n";
      
      // Get all dates with progress
      const progressDates = Object.keys(appData.progress).sort();
      
      // For each date, get the habits completed
      progressDates.forEach(date => {
        const completedHabitIds = appData.progress[date] || [];
        
        // For each habit, add a row to the CSV
        appData.habits.forEach(habit => {
          const isCompleted = completedHabitIds.includes(habit.id);
          csvContent += `${date},"${habit.name}",${isCompleted ? "Yes" : "No"}\n`;
        });
      });
      
      // Create a temporary file
      const fileUri = `${FileSystem.cacheDirectory}progress_report.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvContent);
      
      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Progress Report',
          UTI: 'public.comma-separated-values-text',
        });
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={theme.gradients.background}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
          Your Progress
        </Text>
        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: theme.colors.primary }]}
          onPress={exportProgressReport}
        >
          <Download size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <Animated.ScrollView
        style={animatedViewStyle}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <StreakCounter />
        
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {calculateCompletionRate()}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.secondaryText }]}>
              Completion Rate
            </Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {appData.habits.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.secondaryText }]}>
              Active Habits
            </Text>
          </View>
        </View>
        
        <View style={styles.timeframeSelector}>
          <TouchableOpacity
            style={[
              styles.timeframeButton,
              selectedTimeframe === 'week' && { 
                backgroundColor: theme.colors.primary,
              }
            ]}
            onPress={() => setSelectedTimeframe('week')}
          >
            <Text 
              style={[
                styles.timeframeButtonText,
                { color: selectedTimeframe === 'week' ? '#fff' : theme.colors.text }
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.timeframeButton,
              selectedTimeframe === 'month' && { 
                backgroundColor: theme.colors.primary,
              }
            ]}
            onPress={() => setSelectedTimeframe('month')}
          >
            <Text 
              style={[
                styles.timeframeButtonText,
                { color: selectedTimeframe === 'month' ? '#fff' : theme.colors.text }
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.timeframeButton,
              selectedTimeframe === 'year' && { 
                backgroundColor: theme.colors.primary,
              }
            ]}
            onPress={() => setSelectedTimeframe('year')}
          >
            <Text 
              style={[
                styles.timeframeButtonText,
                { color: selectedTimeframe === 'year' ? '#fff' : theme.colors.text }
              ]}
            >
              Year
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
          Activity Calendar
        </Text>
        
        <ProgressCalendar timeframe={selectedTimeframe} />
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
          Habit Insights
        </Text>
        
        {appData.habits.map(habit => {
          // Count completions for this habit
          let completions = 0;
          Object.values(appData.progress).forEach(habitsArray => {
            if (habitsArray.includes(habit.id)) {
              completions++;
            }
          });
          
          return (
            <View 
              key={habit.id} 
              style={[styles.habitInsight, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.habitName, { color: theme.colors.text }]}>
                {habit.name}
              </Text>
              <View style={styles.habitStats}>
                <Text style={[styles.habitCompletions, { color: theme.colors.secondaryText }]}>
                  {completions} times completed
                </Text>
                <View 
                  style={[
                    styles.habitModeTag, 
                    { 
                      backgroundColor: 
                        habit.mode === 'relaxed' ? theme.colors.relaxed :
                        habit.mode === 'productive' ? theme.colors.productive :
                        theme.colors.secondary
                    }
                  ]}
                >
                  <Text style={styles.habitModeText}>
                    {habit.mode === 'relaxed' ? 'Personal Growth' :
                     habit.mode === 'productive' ? 'Action Mode' :
                     'Both Modes'}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  timeframeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  timeframeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    marginVertical: 16,
  },
  habitInsight: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  habitStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitCompletions: {
    fontSize: 14,
  },
  habitModeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  habitModeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
});