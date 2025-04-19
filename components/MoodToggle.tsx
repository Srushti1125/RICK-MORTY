import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MoodContext } from '@/context/MoodContext';
import { Moon, CloudSun } from 'lucide-react-native';

export default function MoodToggle() {
  const { currentMood, toggleMood, theme } = useContext(MoodContext);

  return (
    <TouchableOpacity 
      onPress={toggleMood}
      style={[styles.container, { backgroundColor: theme.colors.cardBackground }]}
    >
      <View style={styles.toggleWrapper}>
        <View 
          style={[
            styles.indicator, 
            { 
              backgroundColor: theme.colors.primary,
              transform: [{ translateX: currentMood === 'growth' ? 0 : 32 }]
            }
          ]} 
        />
        <View style={styles.iconsContainer}>
          <View style={styles.iconWrapper}>
            <CloudSun 
              size={16} 
              color={currentMood === 'growth' ? 'white' : theme.colors.secondaryText} 
            />
          </View>
          <View style={styles.iconWrapper}>
            <Moon 
              size={16} 
              color={currentMood === 'action' ? 'white' : theme.colors.secondaryText} 
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 4,
  },
  toggleWrapper: {
    width: 64,
    height: 32,
    position: 'relative',
  },
  indicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    position: 'absolute',
    top: 0,
  },
  iconsContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});