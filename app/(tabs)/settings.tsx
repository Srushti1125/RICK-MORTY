import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import { useState, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { 
  User, 
  Bell, 
  FileText, 
  Trash, 
  ChevronRight,
  Github,
  MessageSquareText
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, themeMode } = useTheme();
  const { resetAllData } = useAppData();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('8:00 PM');
  
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
  
  const handleClearData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your habits and progress. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetAllData }
      ]
    );
  };
  
  const SettingItem = ({ icon, title, value, onPress, isSwitch = false, isDestructive = false }) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: theme.colors.border }]} 
      onPress={onPress}
      disabled={isSwitch}
    >
      <View style={styles.settingLeft}>
        {icon}
        <Text 
          style={[
            styles.settingTitle, 
            { 
              color: isDestructive ? theme.colors.error : theme.colors.text,
              fontFamily: theme.fonts.body,
            }
          ]}
        >
          {title}
        </Text>
      </View>
      
      <View style={styles.settingRight}>
        {isSwitch ? (
          <Switch
            value={value}
            onValueChange={onPress}
            trackColor={{ 
              false: theme.colors.border, 
              true: theme.colors.primary 
            }}
            thumbColor="#fff"
          />
        ) : (
          <>
            {value && <Text style={[styles.settingValue, { color: theme.colors.secondaryText }]}>{value}</Text>}
            <ChevronRight size={20} color={theme.colors.secondaryText} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={theme.gradients.background}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
          Settings
        </Text>
      </View>
      
      <Animated.ScrollView
        style={animatedViewStyle}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.secondaryText }]}>
            Account
          </Text>
          
          <SettingItem 
            icon={<User size={20} color={theme.colors.text} style={styles.settingIcon} />}
            title="Profile"
            value=""
            onPress={() => {}}
          />
          
          <SettingItem 
            icon={<Bell size={20} color={theme.colors.text} style={styles.settingIcon} />}
            title="Notifications"
            value={notificationsEnabled}
            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
            isSwitch
          />
          
          <SettingItem 
            icon={<FileText size={20} color={theme.colors.text} style={styles.settingIcon} />}
            title="App Theme"
            value={themeMode === 'relaxed' ? 'Personal Growth' : 'Action Mode'}
            onPress={() => {}}
          />
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.secondaryText }]}>
            Support
          </Text>
          
          <SettingItem 
            icon={<Github size={20} color={theme.colors.text} style={styles.settingIcon} />}
            title="About"
            value=""
            onPress={() => {}}
          />
          
          <SettingItem 
            icon={<MessageSquareText size={20} color={theme.colors.text} style={styles.settingIcon} />}
            title="Send Feedback"
            value=""
            onPress={() => {}}
          />
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.secondaryText }]}>
            Danger Zone
          </Text>
          
          <SettingItem 
            icon={<Trash size={20} color={theme.colors.error} style={styles.settingIcon} />}
            title="Reset All Data"
            isDestructive
            onPress={handleClearData}
          />
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.colors.secondaryText }]}>
            MoodTrack v1.0.0
          </Text>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 24,
  },
  section: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    marginRight: 8,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 14,
  },
});