import { Tabs } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Home, LineChart, Settings, Plus, CalendarDays, MessageCircle } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { theme, themeMode } = useTheme();
  const insets = useSafeAreaInsets();
  const bgColor = useSharedValue(theme.colors.background);
  
  useEffect(() => {
    bgColor.value = withTiming(theme.colors.background, { duration: 500 });
  }, [theme]);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: bgColor.value,
    };
  });
  
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            ...styles.tabBar,
            height: 60 + insets.bottom,
            backgroundColor: 'transparent',
            position: 'absolute',
            borderTopWidth: 0,
            elevation: 0,
            bottom: 0,
          },
          tabBarBackground: () => (
            <BlurView
              intensity={80}
              tint={themeMode === 'relaxed' ? 'light' : 'dark'}
              style={StyleSheet.absoluteFill}
            />
          ),
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="add-habit"
          options={{
            tabBarIcon: ({ color }) => (
              <View style={[styles.addButton, { backgroundColor: theme.colors.primary }]}>
                <Plus size={24} color="#fff" />
              </View>
            ),
          }}
        />
        
        <Tabs.Screen
          name="progress"
          options={{
            tabBarIcon: ({ color, size }) => (
              <LineChart size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="reminders"
          options={{
            tabBarIcon: ({ color, size }) => (
              <CalendarDays size={size} color={color} />
            ),
          }}
        />

        {/* ✅ New Chatbot Tab */}

        <Tabs.Screen
          name="chatbot"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MessageCircle size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Settings size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
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
    shadowRadius: 3,
    elevation: 5,
  },
});

