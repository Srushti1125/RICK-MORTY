import { useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MoodContext } from '@/context/MoodContext';
import MoodToggle from '@/components/MoodToggle';
import HabitSummary from '@/components/HabitSummary';
import { defaultStyles } from '@/constants/Styles';
import { useHabits } from '@/hooks/useHabits';
import { CirclePlus as PlusCircle } from 'lucide-react-native';

export default function HomeScreen() {
  const { theme, currentMood } = useContext(MoodContext);
  const { habits, todaysHabits, completedCount } = useHabits();

  const completionRate = habits.length > 0 
    ? Math.round((completedCount / habits.length) * 100) 
    : 0;

  const greeting = currentMood === 'growth' 
    ? 'Time for growth' 
    : 'Let\'s get schwifty!';

  const quote = currentMood === 'growth'
    ? "The path to greatness requires patience."
    : "Wubba lubba dub dub! Let's crush those habits!";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={[defaultStyles.headingLarge, { color: theme.colors.text }]}>
              {greeting}
            </Text>
            <Text style={[defaultStyles.text, { color: theme.colors.secondaryText }]}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>
          <MoodToggle />
        </View>

        <View style={[styles.quoteCard, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[defaultStyles.headingSmall, { color: theme.colors.text }]}>
            {quote}
          </Text>
          <Image 
            source={{ 
              uri: currentMood === 'growth' 
                ? 'https://images.pexels.com/photos/4439901/pexels-photo-4439901.jpeg?auto=compress&cs=tinysrgb&w=300' 
                : 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=300' 
            }}
            style={styles.quoteImage}
          />
        </View>

        <View style={styles.progressSection}>
          <Text style={[defaultStyles.headingMedium, { color: theme.colors.text }]}>
            Today's Progress
          </Text>
          <View style={[styles.progressCard, { backgroundColor: theme.colors.cardBackground }]}>
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                  {completedCount}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.secondaryText }]}>
                  Completed
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                  {habits.length - completedCount}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.secondaryText }]}>
                  Remaining
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                  {completionRate}%
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.secondaryText }]}>
                  Success Rate
                </Text>
              </View>
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: theme.colors.primary,
                    width: `${completionRate}%`
                  }
                ]} 
              />
            </View>
          </View>
        </View>

        <View style={styles.habitsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[defaultStyles.headingMedium, { color: theme.colors.text }]}>
              Today's Habits
            </Text>
            <TouchableOpacity>
              <PlusCircle color={theme.colors.primary} size={24} />
            </TouchableOpacity>
          </View>
          
          {todaysHabits.length > 0 ? (
            todaysHabits.map(habit => (
              <HabitSummary key={habit.id} habit={habit} />
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.cardBackground }]}>
              <Text style={[defaultStyles.text, { color: theme.colors.secondaryText, textAlign: 'center' }]}>
                No habits for today. Add some habits to get started!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  quoteCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quoteImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  habitsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyState: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});