import { useContext } from 'react';
import { Tabs } from 'expo-router';
import { CalendarDays, Chrome as Home, ChartLine as LineChart, Settings } from 'lucide-react-native';
import { MoodContext } from '@/context/MoodContext';
import { StyleSheet, Text, View } from 'react-native';
import { defaultStyles } from '@/constants/Styles';

export default function TabLayout() {
  const { currentMood, theme } = useContext(MoodContext);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondaryText,
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Regular',
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel text="Home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarIcon: ({ color, size }) => (
            <CalendarDays size={size} color={color} />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel text="Habits" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => (
            <LineChart size={size} color={color} />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel text="Progress" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel text="Settings" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabLabel({ text, color, focused }: { text: string, color: string, focused: boolean }) {
  return (
    <Text 
      style={[
        defaultStyles.text, 
        { 
          color, 
          fontFamily: focused ? 'Poppins-SemiBold' : 'Poppins-Regular',
          fontSize: 12,
        }
      ]}
    >
      {text}
    </Text>
  );
}