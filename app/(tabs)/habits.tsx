import { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MoodContext } from '@/context/MoodContext';
import HabitItem from '@/components/HabitItem';
import { defaultStyles } from '@/constants/Styles';
import { useHabits } from '@/hooks/useHabits';
import { Filter, Plus, Search, X } from 'lucide-react-native';
import { categories } from '@/constants/Categories';

export default function HabitsScreen() {
  const { theme } = useContext(MoodContext);
  const { habits, toggleHabit } = useHabits();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredHabits = habits.filter(habit => {
    const matchesSearch = habit.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? habit.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[defaultStyles.headingLarge, { color: theme.colors.text }]}>
          Your Habits
        </Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.colors.cardBackground }]}>
        <Search size={20} color={theme.colors.secondaryText} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search habits..."
          placeholderTextColor={theme.colors.secondaryText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <X size={20} color={theme.colors.secondaryText} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
            <Filter size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {showFilters && (
        <View style={styles.categoryFilters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.categoryChip,
                { 
                  backgroundColor: selectedCategory === null 
                    ? theme.colors.primary 
                    : theme.colors.cardBackground
                }
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text 
                style={[
                  styles.categoryChipText, 
                  { 
                    color: selectedCategory === null 
                      ? 'white' 
                      : theme.colors.text
                  }
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            
            {categories.map(category => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryChip,
                  { 
                    backgroundColor: selectedCategory === category.value 
                      ? theme.colors.primary 
                      : theme.colors.cardBackground
                  }
                ]}
                onPress={() => setSelectedCategory(
                  selectedCategory === category.value ? null : category.value
                )}
              >
                <Text 
                  style={[
                    styles.categoryChipText, 
                    { 
                      color: selectedCategory === category.value 
                        ? 'white' 
                        : theme.colors.text
                    }
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitItem 
            habit={item} 
            onToggle={() => toggleHabit(item.id)} 
          />
        )}
        contentContainerStyle={styles.habitsList}
        ListEmptyComponent={
          <View style={[styles.emptyState, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[defaultStyles.text, { color: theme.colors.secondaryText, textAlign: 'center' }]}>
              {searchQuery || selectedCategory 
                ? "No habits match your filters" 
                : "No habits found. Add some habits to get started!"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
  },
  categoryFilters: {
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChipText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  habitsList: {
    paddingBottom: 100,
  },
  emptyState: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
});