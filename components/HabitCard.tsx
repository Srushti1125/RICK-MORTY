import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  LayoutAnimation, 
  Platform, 
  UIManager 
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    mode: 'relaxed' | 'productive' | 'both';
  };
  isCompleted: boolean;
  onComplete: () => void;
}

export default function HabitCard({ habit, isCompleted, onComplete }: HabitCardProps) {
  const { theme, themeMode } = useTheme();
  
  const scale = useSharedValue(1);
  const checkmarkScale = useSharedValue(isCompleted ? 1 : 0);
  const rotation = useSharedValue(0);
  
  useEffect(() => {
    // Animate checkmark when completed status changes
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    checkmarkScale.value = withTiming(isCompleted ? 1 : 0, { 
      duration: 300, 
      easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
    });
  }, [isCompleted]);
  
  const triggerHapticFeedback = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(
        isCompleted ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium
      );
    }
  };
  
  const handlePress = () => {
    // Animate card press
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 }, () => {
        // Trigger haptic feedback after animation
        runOnJS(triggerHapticFeedback)();
      })
    );
    
    // Animate rotation on completion
    if (!isCompleted) {
      rotation.value = withSequence(
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    }
    
    onComplete();
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ]
    };
  });
  
  const checkmarkAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: checkmarkScale.value,
      transform: [{ scale: checkmarkScale.value }]
    };
  });
  
  // Determine card background based on mode and completion
  let cardBackground = isCompleted 
    ? theme.colors.success + '20' // 20% opacity
    : theme.colors.card;
    
  // Border color based on habit mode
  let borderColor = theme.colors.border;
  if (habit.mode === 'relaxed') {
    borderColor = theme.colors.relaxed + '40'; // 40% opacity
  } else if (habit.mode === 'productive') {
    borderColor = theme.colors.productive + '40'; // 40% opacity
  }
  
  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[
          styles.card,
          { 
            backgroundColor: cardBackground,
            borderColor: borderColor,
          }
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.contentContainer}>
          <Animated.View 
            style={[
              styles.checkCircle,
              { 
                borderColor: isCompleted ? theme.colors.success : theme.colors.border,
                backgroundColor: isCompleted ? theme.colors.success : 'transparent',
              },
              checkmarkAnimatedStyle
            ]}
          >
            {isCompleted && <Check size={16} color="#fff" />}
          </Animated.View>
          <Text 
            style={[
              styles.habitName, 
              { 
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
                textDecorationLine: isCompleted ? 'line-through' : 'none',
                opacity: isCompleted ? 0.7 : 1,
              }
            ]}
          >
            {habit.name}
          </Text>
        </View>
        
        {/* Mode tag */}
        <View 
          style={[
            styles.modeTag,
            {
              backgroundColor: 
                habit.mode === 'relaxed' ? theme.colors.relaxed + '30' :
                habit.mode === 'productive' ? theme.colors.productive + '30' :
                theme.colors.secondary + '30',
            }
          ]}
        >
          <Text 
            style={[
              styles.modeText,
              {
                color: 
                  habit.mode === 'relaxed' ? theme.colors.relaxed :
                  habit.mode === 'productive' ? theme.colors.productive :
                  theme.colors.secondary,
                fontFamily: theme.fonts.body,
              }
            ]}
          >
            {habit.mode === 'relaxed' ? 'Growth' :
             habit.mode === 'productive' ? 'Action' :
             'Both'}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitName: {
    fontSize: 16,
    flex: 1,
  },
  modeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  modeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});