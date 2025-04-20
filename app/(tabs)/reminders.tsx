import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, ScrollView, Platform, Alert, Switch, StyleSheet, TouchableOpacity, NativeModules } from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as CalendarAPI from 'expo-calendar';
import * as Notifications from 'expo-notifications';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Device from 'expo-device';

// Interface for our native alarm module
// In a real implementation you'd create this native module
interface AlarmModuleInterface {
  setAlarm(title: string, timestamp: number, id: string): Promise<string>;
  setRecurringAlarm(title: string, timestamp: number, id: string, dayOfWeek: number): Promise<string>;
}

// Access the native module (in a real implementation)
const AlarmModule = NativeModules.AlarmModule as AlarmModuleInterface;

export default function RemindersTab() {
  const [habit, setHabit] = useState('');
  const [timeInMin, setTimeInMin] = useState('60');
  const [calendarId, setCalendarId] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [alarmPermissionGranted, setAlarmPermissionGranted] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(new Date());
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  // Get calendar permission & create local calendar
  useEffect(() => {
    (async () => {
      const { status } = await CalendarAPI.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await CalendarAPI.getCalendarsAsync(CalendarAPI.EntityTypes.EVENT);
        const local = calendars.find(cal => cal.allowsModifications);
        if (local) {
          setCalendarId(local.id);
        } else {
          // Create a new calendar if none exists
          try {
            const newCalendarId = await createCalendar();
            setCalendarId(newCalendarId);
          } catch (e) {
            Alert.alert('Calendar Error', 'Failed to create a new calendar');
          }
        }
      } else {
        Alert.alert('Calendar Permission', 'Calendar access is needed for this feature to work properly');
      }
      
      // Request notification permissions
      const { status: notificationStatus } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      
      if (notificationStatus !== 'granted') {
        Alert.alert('Notification Permission', 'Notification access is needed for reminders to work properly');
      }
      
      // On Android, check for alarm setting permission
      if (Platform.OS === 'android') {
        checkAlarmPermission();
      } else {
        setAlarmPermissionGranted(true); // iOS handles alarms differently
      }
    })();
  }, []);

  // Check and request alarm permission on Android
  const checkAlarmPermission = async () => {
    if (Platform.OS === 'android' && Device.osVersion && parseInt(Device.osVersion) >= 13) {
      try {
        const { status } = await Notifications.getPermissionsAsync();
        const hasAlarmPermission = status === 'granted';
        setAlarmPermissionGranted(hasAlarmPermission);
        
        if (!hasAlarmPermission) {
          Alert.alert(
            'Alarm Permission Required',
            'This app needs permission to set alarms. Please grant this permission in settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Open Settings', 
                onPress: () => openAlarmSettings() 
              }
            ]
          );
        }
      } catch (error) {
        console.error('Error checking alarm permission:', error);
      }
    } else {
      setAlarmPermissionGranted(true);
    }
  };

  // Create a new calendar
  const createCalendar = async () => {
    const defaultCalendarSource = Platform.OS === 'ios'
      ? await CalendarAPI.getDefaultCalendarAsync()
      : { isLocalAccount: true, name: 'Habit Tracker' };
    
    const newCalendar = {
      title: 'Habit Tracker',
      color: '#3b82f6',
      entityType: CalendarAPI.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: 'HabitTrackerCalendar',
      ownerAccount: 'personal',
      accessLevel: CalendarAPI.CalendarAccessLevel.OWNER,
    };

    return await CalendarAPI.createCalendarAsync(newCalendar);
  };

  // Open device alarm settings
  const openAlarmSettings = async () => {
    if (Platform.OS === 'android') {
      try {
        // For newer Android versions
        await IntentLauncher.startActivityAsync(
          'android.settings.APPLICATION_DETAILS_SETTINGS',
          { data: 'package:' + Device.deviceName }
        );
      } catch (error) {
        console.error('Failed to open settings:', error);
        // Fallback to app settings
        Linking.openSettings();
      }
    } else if (Platform.OS === 'ios') {
      // iOS doesn't have specific alarm settings, open app settings instead
      Linking.openSettings();
    }
  };

  // Notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  // Format date for display and identification
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Calculate alarm time
  const calculateAlarmTime = (minutesFromNow: number) => {
    const now = new Date();
    return new Date(now.getTime() + minutesFromNow * 60 * 1000);
  };

  // Add habit reminder (one time or recurring)
  const addHabitReminder = async () => {
    if (!habit.trim()) {
      Alert.alert("Error", "Please enter a habit name.");
      return;
    }

    if (!timeInMin.trim() || isNaN(parseInt(timeInMin)) || parseInt(timeInMin) <= 0) {
      Alert.alert("Error", "Please enter a valid time in minutes.");
      return;
    }

    if (!alarmPermissionGranted) {
      Alert.alert(
        "Permission Required", 
        "Alarm permission is required to set reminders. Would you like to grant permission now?",
        [
          { text: "No", style: "cancel" },
          { text: "Yes", onPress: () => openAlarmSettings() }
        ]
      );
      return;
    }

    const minutesFromNow = parseInt(timeInMin);
    const now = new Date();
    const alarmTime = calculateAlarmTime(minutesFromNow);
    const habitId = Date.now().toString();
    
    try {
      // Add to device calendar
      if (calendarId) {
        let recurrenceRule = null;
        
        if (isRecurring) {
          // Create weekly recurrence
          const dayOfWeek = alarmTime.getDay() + 1; // 1=Sunday, 7=Saturday
          recurrenceRule = {
            frequency: CalendarAPI.Frequency.WEEKLY,
            interval: 1, // Every week
            occurrence: 52, // For up to a year
          };
        }
        
        const eventDetails = {
          title: `Habit: ${habit}`,
          startDate: alarmTime,
          endDate: new Date(alarmTime.getTime() + 15 * 60 * 1000), // 15 min duration
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Use device timezone
          notes: 'Habit Reminder',
          alarms: [{ relativeOffset: -15 }], // Alert 15 minutes before
          recurrenceRule: recurrenceRule,
        };

        await CalendarAPI.createEventAsync(calendarId, eventDetails);
        
        // Mark the date on the calendar
        const dateKey = formatDate(alarmTime);
        setMarkedDates(prev => ({
          ...prev,
          [dateKey]: { 
            marked: true, 
            dotColor: isRecurring ? '#10b981' : '#3b82f6' // Green for recurring, blue for one-time
          },
        }));
      }

      // Set a system notification/alarm
      if (isRecurring) {
        // For recurring notifications
        const weekday = alarmTime.getDay(); // 0-6 (0 is Sunday)
        
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: '⏰ Time for your habit!',
            body: habit,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
            data: { habitId, isRecurring: true },
          },
          trigger: {
            weekday: weekday + 1, // Notifications API uses 1-7 (1 is Sunday)
            hour: alarmTime.getHours(),
            minute: alarmTime.getMinutes(),
            repeats: true,
            channelId: 'habit-alarms',
          },
        });
        
        // For Android, set recurring alarm using native module
        if (Platform.OS === 'android') {
          try {
            // In a real implementation this would call:
            // await AlarmModule.setRecurringAlarm(
            //   habit,
            //   alarmTime.getTime(),
            //   habitId,
            //   weekday
            // );
            console.log('Setting recurring alarm for', habit, 'on weekday', weekday);
          } catch (error) {
            console.error('Failed to set native recurring alarm:', error);
          }
        }
      } else {
        // For one-time notifications
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: '⏰ Time for your habit!',
            body: habit,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
            data: { habitId, isRecurring: false },
          },
          trigger: {
            date: alarmTime,
            channelId: 'habit-alarms',
          },
        });
        
        // For Android, set one-time alarm using native module
        if (Platform.OS === 'android') {
          try {
            // In a real implementation this would call:
            // await AlarmModule.setAlarm(
            //   habit,
            //   alarmTime.getTime(),
            //   habitId
            // );
            console.log('Setting one-time alarm for', habit, 'at', alarmTime);
          } catch (error) {
            console.error('Failed to set native one-time alarm:', error);
          }
        }
      }

      Alert.alert(
        'Success!', 
        `Habit "${habit}" reminder ${isRecurring ? 'will repeat weekly' : 'set for ' + alarmTime.toLocaleTimeString()}`
      );
      
      // Reset form
      setHabit('');
      setTimeInMin('60');
      
    } catch (error) {
      console.error('Error setting reminder:', error);
      Alert.alert('Error', 'Failed to set the reminder. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Set Reminder</Text>

      <Calendar
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: '#3b82f6',
          dotColor: '#3b82f6',
          todayTextColor: '#3b82f6',
        }}
      />

      <View style={styles.formContainer}>
        <Text style={styles.subheading}>Set a Habit Reminder</Text>
        
        <Text style={styles.label}>Habit Name:</Text>
        <TextInput
          placeholder="e.g. Meditate, Take medication, Exercise"
          value={habit}
          onChangeText={setHabit}
          style={styles.input}
        />

        <Text style={styles.label}>Remind me in (minutes):</Text>
        <TextInput
          value={timeInMin}
          onChangeText={setTimeInMin}
          keyboardType="numeric"
          placeholder="60"
          style={styles.input}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Repeat Weekly:</Text>
          <Switch
            value={isRecurring}
            onValueChange={setIsRecurring}
            trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
            thumbColor={isRecurring ? '#3b82f6' : '#f4f3f4'}
          />
          <Text style={styles.switchValueText}>
            {isRecurring ? 'Every week on the same day' : 'Just once'}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={addHabitReminder}
        >
          <Text style={styles.buttonText}>
            {isRecurring ? 'Set Weekly Recurring Alarm' : 'Set One-Time Alarm'}
          </Text>
        </TouchableOpacity>
        
        {!alarmPermissionGranted && Platform.OS === 'android' && (
          <Text style={styles.errorText}>
            Alarm permission is required. Please grant permission in settings.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  formContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  label: {
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  switchLabel: {
    fontWeight: '500',
    marginRight: 10,
  },
  switchValueText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#4b5563',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ef4444',
    marginTop: 15,
  },
});