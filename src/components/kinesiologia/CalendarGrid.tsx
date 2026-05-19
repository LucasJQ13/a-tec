import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { healthColors } from '../../constants/healthTheme';

type CalendarDay = {
  day: number;
  isSelected: boolean;
  isAvailable: boolean;
};

type CalendarGridProps = {
  days: CalendarDay[];
};

const weekDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
const months = ['Octubre', 'Noviembre', 'Diciembre'];

export function CalendarGrid({ days }: CalendarGridProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.months}>
        {months.map((month) => {
          const active = month === 'Noviembre';

          return (
            <View key={month} style={[styles.monthPill, active ? styles.activeMonth : null]}>
              <Text style={[styles.monthText, active ? styles.activeMonthText : null]}>{month}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.weekRow}>
        {weekDays.map((day) => (
          <Text key={day} style={styles.weekDay}>{day}</Text>
        ))}
      </View>

      <View style={styles.dayGrid}>
        {days.map((day) => (
          <TouchableOpacity
            key={day.day}
            activeOpacity={0.82}
            style={[
              styles.day,
              day.isAvailable ? styles.availableDay : null,
              day.isSelected ? styles.selectedDay : null,
            ]}
          >
            <Text style={[styles.dayText, day.isSelected ? styles.selectedDayText : null]}>{day.day}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: healthColors.cream,
    borderColor: healthColors.olive,
    borderRadius: 28,
    borderWidth: 1,
    padding: 16,
  },
  months: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  monthPill: {
    alignItems: 'center',
    borderColor: healthColors.olive,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    minHeight: 34,
    justifyContent: 'center',
  },
  activeMonth: {
    backgroundColor: healthColors.night,
    borderColor: healthColors.night,
  },
  monthText: {
    color: healthColors.night,
    fontSize: 11,
    fontWeight: '900',
  },
  activeMonthText: {
    color: healthColors.cream,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  weekDay: {
    color: healthColors.olive,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
    width: '13%',
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 10,
  },
  day: {
    alignItems: 'center',
    borderColor: healthColors.cream,
    borderRadius: 12,
    borderWidth: 1,
    height: 35,
    justifyContent: 'center',
    width: '12.2%',
  },
  availableDay: {
    borderColor: healthColors.olive,
  },
  selectedDay: {
    backgroundColor: healthColors.night,
    borderColor: healthColors.night,
  },
  dayText: {
    color: healthColors.night,
    fontSize: 12,
    fontWeight: '900',
  },
  selectedDayText: {
    color: healthColors.cream,
  },
});
