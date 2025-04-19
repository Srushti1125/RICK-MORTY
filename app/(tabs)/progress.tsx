import { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MoodContext } from '@/context/MoodContext';
import { defaultStyles } from '@/constants/Styles';
import { useHabits } from '@/hooks/useHabits';
import ProgressChart from '@/components/ProgressChart';
import { categories } from '@/constants/Categories';

export default function ProgressScreen() {
  const { theme } = useContext(MoodContext);
  const { habits, getCompletionRate } = useHabits();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[defaultStyles.headingLarge, { color: theme.colors.text, marginBottom: 24 }]}>
          Your Progress
        </Text>

        <View style={[styles.overallCard, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[defaultStyles.headingMedium, { color: theme.colors.text }]}>
            Overall Completion
          </Text>
          <View style={styles.chartContainer}>
            <ProgressChart 
              percentage={getCompletionRate()}
              color={theme.colors.primary}
              size={150}
              thickness={12}
            />
          </View>
        </View>

        <Text style={[defaultStyles.headingMedium, { color: theme.colors.text, marginTop: 24, marginBottom: 16 }]}>
          Completion by Category
        </Text>

        {categories.map(category => {
          const categoryHabits = habits.filter(h => h.category === category.value);
          const completionRate = getCompletionRate(categoryHabits);
          
          if (categoryHabits.length === 0) return null;

          return (
            <View 
              key={category.value}
              style={[styles.categoryCard, { backgroundColor: theme.colors.cardBackground }]}
            >
              <View style={styles.categoryHeader}>
                <Text style={[defaultStyles.headingSmall, { color: theme.colors.text }]}>
                  {category.label}
                </Text>
                <Text style={[styles.percentage, { color: theme.colors.primary }]}>
                  {completionRate}%
                </Text>
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
              <Text style={[styles.habitCount, { color: theme.colors.secondaryText }]}>
                {categoryHabits.filter(h => h.completed).length} of {categoryHabits.length} habits completed
              </Text>
            </View>
          );
        })}

        <View style={[styles.streakCard, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[defaultStyles.headingMedium, { color: theme.colors.text }]}>
            Current Streak
          </Text>
          <View style={styles.streakValue}>
            <Text style={[styles.streakNumber, { color: theme.colors.primary }]}>7</Text>
            <Text style={[styles.streakText, { color: theme.colors.text }]}>days</Text>
          </View>
          <Text style={[styles.streakSubtext, { color: theme.colors.secondaryText }]}>
            Keep it up! You're doing great!
          </Text>
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
    paddingBottom: 100,
  },
  overallCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  categoryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  percentage: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  habitCount: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  streakCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakValue: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 12,
    marginBottom: 8,
  },
  streakNumber: {
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
  },
  streakText: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
    marginLeft: 4,
  },
  streakSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});