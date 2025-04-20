import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame } from 'lucide-react-native';

export default function StreakCounter() {
  const { theme } = useTheme();
  const { appData } = useAppData();
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);
  
  useEffect(() => {
    // Entrance animation
    opacity.value = withTiming(1, { duration: 500 });
    
    // Pulse animation for streak
    if (appData.currentStreak > 0) {
      scale.value = withDelay(
        500,
        withSequence(
          withTiming(1.1, { duration: 300 }),
          withTiming(1, { duration: 300 })
        )
      );
      
      // Rotate flame
      rotate.value = withDelay(
        500,
        withSequence(
          withTiming(-5, { duration: 300 }),
          withTiming(5, { duration: 300 }),
          withTiming(0, { duration: 300 })
        )
      );
    }
  }, [appData.currentStreak]);
  
  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });
  
  const flameAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value}deg` }],
    };
  });
  
  // Gradient colors based on streak length
  const getGradientColors = () => {
    if (appData.currentStreak >= 30) {
      return ['#6366f1', '#2563eb']; // Purple to blue for 30+ days
    } else if (appData.currentStreak >= 7) {
      return ['#f97316', '#f43f5e']; // Orange to red for 7+ days
    } else {
      return ['#64748b', '#94a3b8']; // Gray for less than 7 days
    }
  };
  
  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <Animated.View style={flameAnimatedStyle}>
            <Flame size={28} color="#fff" />
          </Animated.View>
          <View style={styles.textContainer}>
            <Text style={styles.streakCount}>
              {appData.currentStreak}
            </Text>
            <Text style={styles.streakLabel}>
              Day{appData.currentStreak !== 1 ? 's' : ''} Streak
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  gradient: {
    borderRadius: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  textContainer: {
    marginLeft: 12,
  },
  streakCount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  streakLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
});