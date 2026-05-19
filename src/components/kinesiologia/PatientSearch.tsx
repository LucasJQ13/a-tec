import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { healthColors } from '../../constants/healthTheme';

export function PatientSearch() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Buscar paciente</Text>
        <View style={styles.line} />
      </View>
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Buscar por nombre, email o telefono"
          placeholderTextColor={healthColors.olive}
          style={styles.input}
        />
        <TouchableOpacity activeOpacity={0.82} style={styles.button}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 22,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  title: {
    color: healthColors.night,
    fontSize: 17,
    fontWeight: '900',
  },
  line: {
    backgroundColor: healthColors.night,
    borderRadius: 2,
    flex: 1,
    height: 3,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  input: {
    backgroundColor: healthColors.cream,
    borderColor: healthColors.olive,
    borderRadius: 18,
    borderWidth: 1,
    color: healthColors.night,
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    minHeight: 48,
    paddingHorizontal: 14,
  },
  button: {
    alignItems: 'center',
    backgroundColor: healthColors.night,
    borderRadius: 18,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 18,
  },
  buttonText: {
    color: healthColors.cream,
    fontSize: 13,
    fontWeight: '900',
  },
});
