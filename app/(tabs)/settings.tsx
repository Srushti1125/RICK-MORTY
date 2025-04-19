import { useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MoodContext } from '@/context/MoodContext';
import { defaultStyles } from '@/constants/Styles';
import { Bell, ChevronRight, CloudSun, Download, CircleHelp as HelpCircle, Info, LogOut, Moon, Trash } from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, currentMood, toggleMood } = useContext(MoodContext);

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    rightElement, 
    danger = false,
    onPress 
  }: { 
    icon: React.ReactNode, 
    title: string, 
    subtitle?: string,
    rightElement?: React.ReactNode,
    danger?: boolean,
    onPress?: () => void
  }) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIconContainer}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text 
          style={[
            defaultStyles.headingSmall, 
            { 
              color: danger ? theme.colors.error : theme.colors.text,
              fontSize: 16
            }
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: theme.colors.secondaryText }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement || (
        <ChevronRight size={20} color={theme.colors.secondaryText} />
      )}
    </TouchableOpacity>
  );

  const SettingsSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <View style={styles.settingsSection}>
      <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
        {title}
      </Text>
      <View style={[styles.sectionContent, { backgroundColor: theme.colors.cardBackground }]}>
        {children}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[defaultStyles.headingLarge, { color: theme.colors.text, marginBottom: 24 }]}>
          Settings
        </Text>

        <SettingsSection title="Preferences">
          <SettingItem 
            icon={currentMood === 'growth' ? <CloudSun size={24} color={theme.colors.primary} /> : <Moon size={24} color={theme.colors.primary} />}
            title="Default Mood"
            subtitle={currentMood === 'growth' ? "Personal Growth Mode" : "Action Mode"}
            rightElement={
              <Switch
                value={currentMood === 'action'}
                onValueChange={toggleMood}
                trackColor={{ false: '#D1D5DB', true: theme.colors.primaryLight }}
                thumbColor={theme.colors.primary}
              />
            }
          />
          <SettingItem 
            icon={<Bell size={24} color={theme.colors.primary} />}
            title="Notifications"
            subtitle="Manage your habit reminders"
            onPress={() => {}}
          />
        </SettingsSection>

        <SettingsSection title="Data">
          <SettingItem 
            icon={<Download size={24} color={theme.colors.primary} />}
            title="Export Progress"
            subtitle="Export your habit data as PDF"
            onPress={() => {}}
          />
          <SettingItem 
            icon={<Trash size={24} color={theme.colors.error} />}
            title="Clear All Data"
            subtitle="Remove all habits and progress"
            danger
            onPress={() => {}}
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingItem 
            icon={<HelpCircle size={24} color={theme.colors.primary} />}
            title="Help & FAQ"
            onPress={() => {}}
          />
          <SettingItem 
            icon={<Info size={24} color={theme.colors.primary} />}
            title="About"
            subtitle="Version 1.0.0"
            onPress={() => {}}
          />
        </SettingsSection>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: theme.colors.cardBackground }]}
        >
          <LogOut size={20} color={theme.colors.error} />
          <Text style={[styles.logoutText, { color: theme.colors.error }]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionContent: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
});