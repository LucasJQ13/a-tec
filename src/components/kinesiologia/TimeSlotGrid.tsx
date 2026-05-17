import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { healthColors } from '../../constants/healthTheme';

type TimeSlotGridProps = {
  times: string[];
};

export function TimeSlotGrid({ times }: TimeSlotGridProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Horarios disponibles</Text>
      <View style={styles.grid}>
        {times.map((time) => {
          const selected = time === '10:00 AM';

          return (
            <TouchableOpacity
              key={time}
              activeOpacity={0.82}
              style={[styles.slot, selected ? styles.selectedSlot : null]}
            >
              <Text style={[styles.slotText, selected ? styles.selectedSlotText : null]}>{time}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity activeOpacity={0.84} style={styles.primaryButton}>
          <Text style={styles.buttonText}>RESERVAR</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.84} style={styles.secondaryButton}>
          <Text style={styles.buttonText}>CANCELAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 18,
  },
  title: {
    color: healthColors.night,
    fontSize: 18,
    fontWeight: '900',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  slot: {
    alignItems: 'center',
    backgroundColor: healthColors.cream,
    borderColor: healthColors.olive,
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 40,
    justifyContent: 'center',
    width: '47%',
  },
  selectedSlot: {
    backgroundColor: healthColors.night,
    borderColor: healthColors.night,
  },
  slotText: {
    color: healthColors.night,
    fontSize: 13,
    fontWeight: '900',
  },
  selectedSlotText: {
    color: healthColors.cream,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: healthColors.night,
    borderRadius: 20,
    flex: 1,
    minHeight: 48,
    justifyContent: 'center',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: healthColors.olive,
    borderRadius: 20,
    flex: 1,
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonText: {
    color: healthColors.cream,
    fontSize: 13,
    fontWeight: '900',
  },
});
