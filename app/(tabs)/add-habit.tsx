import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,

  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import { router } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { suggestedHabits } from '@/data/habits';

export default function AddHabitScreen() {
  const { theme, themeMode } = useTheme();
  const { addHabit } = useAppData();
  
  const [habitName, setHabitName] = useState('');
  const [selectedMode, setSelectedMode] = useState<'relaxed' | 'productive' | 'both'>(themeMode);
  
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
  
  const handleAddHabit = () => {
    if (habitName.trim()) {
      addHabit({
        name: habitName.trim(),
        mode: selectedMode,
      });
      router.back();
    }
  };
  
  const handleSuggestedHabit = (name: string) => {
    setHabitName(name);
  };
  
  // Filter suggestions based on selected mode
  const filteredSuggestions = suggestedHabits.filter(
    habit => habit.mode === selectedMode || habit.mode === 'both'
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={theme.gradients.background}
        style={StyleSheet.absoluteFill}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            Add New Habit
          </Text>
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: habitName.trim() ? theme.colors.primary : theme.colors.disabled }
            ]}
            onPress={handleAddHabit}
            disabled={!habitName.trim()}
          >
            <Check size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <Animated.ScrollView
          style={animatedViewStyle}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.colors.secondaryText }]}>
              Habit Name
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                  fontFamily: theme.fonts.body,
                }
              ]}
              placeholder="Enter habit name..."
              placeholderTextColor={theme.colors.secondaryText}
              value={habitName}
              onChangeText={setHabitName}
            />
          </View>
          
          <View style={styles.modeSelector}>
            <Text style={[styles.inputLabel, { color: theme.colors.secondaryText }]}>
              Mode
            </Text>
            <View style={styles.modeButtons}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  { 
                    backgroundColor: selectedMode === 'relaxed' 
                      ? theme.colors.primary 
                      : theme.colors.card 
                  }
                ]}
                onPress={() => setSelectedMode('relaxed')}
              >
                <Text 
                  style={[
                    styles.modeButtonText,
                    { 
                      color: selectedMode === 'relaxed' 
                        ? '#fff' 
                        : theme.colors.text 
                    }
                  ]}
                >
                  Personal Growth
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  { 
                    backgroundColor: selectedMode === 'productive' 
                      ? theme.colors.primary 
                      : theme.colors.card 
                  }
                ]}
                onPress={() => setSelectedMode('productive')}
              >
                <Text 
                  style={[
                    styles.modeButtonText,
                    { 
                      color: selectedMode === 'productive' 
                        ? '#fff' 
                        : theme.colors.text 
                    }
                  ]}
                >
                  Action Mode
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  { 
                    backgroundColor: selectedMode === 'both' 
                      ? theme.colors.primary 
                      : theme.colors.card 
                  }
                ]}
                onPress={() => setSelectedMode('both')}
              >
                <Text 
                  style={[
                    styles.modeButtonText,
                    { 
                      color: selectedMode === 'both' 
                        ? '#fff' 
                        : theme.colors.text 
                    }
                  ]}
                >
                  Both Modes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={[styles.suggestionsTitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            Suggested Habits
          </Text>
          
          <View style={styles.suggestionsContainer}>
            {filteredSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionButton,
                  { backgroundColor: theme.colors.card }
                ]}
                onPress={() => handleSuggestedHabit(suggestion.name)}
              >
                <Text style={[styles.suggestionText, { color: theme.colors.text }]}>
                  {suggestion.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
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
    fontSize: 20,
    fontWeight: '700',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
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
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  modeSelector: {
    marginBottom: 24,
  },
  modeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionsTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  suggestionsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 8,
  },
  suggestionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
  },
});