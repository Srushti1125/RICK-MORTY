import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import { getDatesBetween, formatDate } from '@/utils/dateUtils';

interface ProgressCalendarProps {
  timeframe: 'week' | 'month' | 'year';
}

export default function ProgressCalendar({ timeframe }: ProgressCalendarProps) {
  const { theme } = useTheme();
  const { appData } = useAppData();
  const [calendarData, setCalendarData] = useState<Array<{ date: string, count: number }>>([]);

  useEffect(() => {
    const today = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
    }

    const dateRange = getDatesBetween(startDate, today);

    if (timeframe === 'year') {
      // Group by month
      const monthlyData: { [month: string]: number } = {};

      dateRange.forEach(date => {
        const month = date.toLocaleDateString(undefined, { month: 'short' });
        const dateString = formatDate(date);
        const completions = appData.progress[dateString]?.length || 0;

        monthlyData[month] = (monthlyData[month] || 0) + completions;
      });

      const formatted = Object.keys(monthlyData).map(month => ({
        date: month,
        count: monthlyData[month],
      }));

      setCalendarData(formatted);
      return;
    }

    // For week and month
    const data = dateRange.map(date => {
      const dateString = formatDate(date);
      const completionsForDate = appData.progress[dateString] || [];

      return {
        date: dateString,
        count: completionsForDate.length,
      };
    });

    setCalendarData(data);
  }, [timeframe, appData.progress]);

  const maxCount = Math.max(...calendarData.map(d => d.count), 1);

  const getColorForCount = (count: number) => {
    if (count === 0) return theme.colors.card;

    const intensity = count / maxCount;

    if (theme.themeMode === 'relaxed') {
      return `rgba(139, 92, 246, ${0.2 + intensity * 0.8})`; // Purple
    } else {
      return `rgba(244, 63, 94, ${0.2 + intensity * 0.8})`; // Red
    }
  };

  const formatDisplayDate = (dateString: string) => {
    if (timeframe === 'year') return dateString;
  
    const date = new Date(dateString);
  
    switch (timeframe) {
      case 'week':
        return date.toLocaleDateString(undefined, { weekday: 'short' });
      case 'month':
        return date.getDate().toString(); // Only show the day number
      default:
        return dateString;
    }
  };

  if (timeframe === 'week') {
    return (
      <View style={styles.weekContainer}>
        {calendarData.map((day, index) => (
          <View key={index} style={styles.dayColumn}>
            <Text style={[styles.dayLabel, { color: theme.colors.secondaryText }]}>
              {formatDisplayDate(day.date)}
            </Text>
            <View
              style={[
                styles.dayCircle,
                { backgroundColor: getColorForCount(day.count) }
              ]}
            >
              <Text style={[styles.dayCount, { color: theme.colors.text }]}>
                {day.count}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.heatmapContainer}>
        {calendarData.map((day, index) => (
          <View
            key={index}
            style={[
              styles.heatmapCell,
              { backgroundColor: getColorForCount(day.count) }
            ]}
          >
            <Text style={[styles.heatmapDate, { color: theme.colors.text }]}>
              {formatDisplayDate(day.date)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  heatmapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
  },
  heatmapCell: {
    width: 40,
    height: 40,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  heatmapDate: {
    fontSize: 12,
  },
});
