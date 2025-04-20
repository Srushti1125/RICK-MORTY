import { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  withTiming, 
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import { Cloud, Sun, Moon } from 'lucide-react-native';

export default function WelcomeScreen() {
  const { setThemeMode } = useTheme();
  const { appData, initializeAppData } = useAppData();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    // Initialize app data
    initializeAppData();
    
    // Animate welcome elements
    opacity.value = withTiming(1, { duration: 800, easing: Easing.ease });
    scale.value = withTiming(1, { duration: 800, easing: Easing.ease });
    
    // Check if user already has a preferred mode
    if (appData.lastMode) {
      // Automatically redirect to the last mode after 1.5 seconds
      const timer = setTimeout(() => {
        setThemeMode(appData.lastMode);
        router.replace('/(tabs)');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [appData.lastMode]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const handleModeSelect = (mode: 'relaxed' | 'productive') => {
    setThemeMode(mode);
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient
      colors={['#f5f7fa', '#c3cfe2']}
      style={styles.container}
    >
      <Animated.View style={[styles.content, animatedStyle]}>
        <View style={styles.logoContainer}>
          <Cloud color="#6366f1" size={56} />
          <Text style={styles.title}>MoodTrack</Text>
        </View>
        
        <Text style={styles.subtitle}>
          How are you feeling today?
        </Text>
        
        <View style={styles.modeContainer}>
          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => handleModeSelect('relaxed')}
          >
            <LinearGradient
              colors={['#a1c4fd', '#c2e9fb']}
              style={styles.modeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Moon color="#fff" size={40} />
              <Text style={styles.modeTitle}>Personal Growth</Text>
              <Text style={styles.modeSubtitle}>Calm & Relaxed</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => handleModeSelect('productive')}
          >
            <LinearGradient
              colors={['#fa709a', '#fee140']}
              style={styles.modeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Sun color="#fff" size={40} />
              <Text style={styles.modeTitle}>Action Mode</Text>
              <Text style={styles.modeSubtitle}>Productive & Focused</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Nunito-Bold',
    color: '#1e293b',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Regular',
    color: '#475569',
    marginBottom: 40,
    textAlign: 'center',
  },
  modeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  modeCard: {
    width: '48%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  modeGradient: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#fff',
    marginTop: 16,
    textAlign: 'center',
  },
  modeSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
  },
});