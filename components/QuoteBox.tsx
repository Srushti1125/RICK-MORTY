import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { relaxedQuotes, productiveQuotes } from '@/data/quotes';

export default function QuoteBox() {
  const { theme, themeMode } = useTheme();
  const [quote, setQuote] = useState('');
  
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  
  useEffect(() => {
    // When theme changes, update quote with animation
    opacity.value = 0;
    scale.value = 0.9;
    
    // Get a random quote based on theme mode
    const quotes = themeMode === 'relaxed' ? relaxedQuotes : productiveQuotes;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
    
    // Animate in the new quote
    opacity.value = withTiming(1, { duration: 500, easing: Easing.ease });
    scale.value = withTiming(1, { duration: 500, easing: Easing.ease });
  }, [themeMode]);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });
  
  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.colors.card },
        animatedStyle,
      ]}
    >
      <Text 
        style={[
          styles.quote, 
          { 
            color: theme.colors.text,
            fontFamily: theme.fonts.heading,
          }
        ]}
      >
        {quote}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quote: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});