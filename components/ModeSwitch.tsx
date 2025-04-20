import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';

interface ModeSwitchProps {
  value: boolean;
  onToggle: () => void;
}

export default function ModeSwitch({ value, onToggle }: ModeSwitchProps) {
  const { theme } = useTheme();

  const translateX = useSharedValue(value ? 28 : 0);
  const scaleThumb = useSharedValue(1);
  const scaleTrack = useSharedValue(1);

  useEffect(() => {
    translateX.value = withTiming(value ? 28 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [value]);

  const handlePress = () => {
    scaleThumb.value = withSequence(
      withTiming(0.8, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    scaleTrack.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    onToggle();
  };

  const productiveColor = '#A3D5FF'; // Soft pastel blue
  const activeColor = '#FF6F61'; // Energetic coral/orange

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scale: scaleThumb.value },
      ],
      backgroundColor: value ? activeColor : productiveColor,
    };
  });

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translateX.value,
      [0, 28],
      [productiveColor + '40', activeColor + '40']
    );
    return {
      backgroundColor,
      transform: [{ scale: scaleTrack.value }],
    };
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.track, trackAnimatedStyle]}>
        <Animated.View style={[styles.thumb, thumbAnimatedStyle]}>
          <Text style={styles.emoji}>
            {value ? '⚡' : '🧘'}
          </Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    width: 56,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    padding: 2,
  },
  thumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 16,
  },
});
