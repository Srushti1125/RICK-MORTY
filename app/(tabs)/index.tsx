import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import HabitCard from '@/components/HabitCard';
import QuoteBox from '@/components/QuoteBox';
import ModeSwitch from '@/components/ModeSwitch';
import DailyProgress from '@/components/DailyProgress';
import { getCurrentDate } from '@/utils/dateUtils';

export default function HomeScreen() {
  const { theme, themeMode, toggleThemeMode } = useTheme();
  const { appData, completeHabit } = useAppData();
  
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  
  useEffect(() => {
    // Animate elements when screen loads
    opacity.value = withTiming(1, { duration: 800, easing: Easing.ease });
    translateY.value = withTiming(0, { duration: 800, easing: Easing.ease });
  }, []);
  
  // Transition animation when theme changes
  useEffect(() => {
    // Reset and replay animations when theme changes
    opacity.value = 0;
    translateY.value = 20;
    
    // Start animations again
    opacity.value = withTiming(1, { duration: 500, easing: Easing.ease });
    translateY.value = withTiming(0, { duration: 500, easing: Easing.ease });
  }, [themeMode]);
  
  const animatedViewStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });
  
  // Filter habits for current mode
  const todayDate = getCurrentDate();
  const filteredHabits = appData.habits.filter(
    habit => habit.mode === themeMode || habit.mode === 'both'
  );
  
  // Get today's completed habits
  const todayProgress = appData.progress[todayDate] || [];
  
  const handleHabitComplete = (habitId: string) => {
    completeHabit(habitId);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={theme.gradients.background}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.colors.text }]}>
            {themeMode === 'relaxed' ? 'Take it easy' : 'Crush your goals'}
          </Text>
          <Text style={[styles.date, { color: theme.colors.secondaryText }]}>
            {todayDate}
          </Text>
        </View>
        <ModeSwitch 
          value={themeMode === 'productive'} 
          onToggle={toggleThemeMode} 
        />
      </View>
      
      <Animated.ScrollView
        style={animatedViewStyle}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <QuoteBox />
        
        <DailyProgress />
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
          Today's Habits
        </Text>
        
        <View style={styles.habitsContainer}>
          {filteredHabits.length > 0 ? (
            filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompleted={todayProgress.includes(habit.id)}
                onComplete={() => handleHabitComplete(habit.id)}
              />
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.emptyStateText, { color: theme.colors.secondaryText }]}>
                No habits yet. Add some to get started!
              </Text>
            </View>
          )}
        </View>
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
  greeting: {
    fontSize: 28,
    fontWeight: '700',
  },
  date: {
    fontSize: 16,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    marginVertical: 16,
  },
  habitsContainer: {
    gap: 12,
  },
  emptyState: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
});