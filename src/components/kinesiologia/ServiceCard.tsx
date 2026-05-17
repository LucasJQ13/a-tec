import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { healthColors } from '../../constants/healthTheme';

type ServiceCardProps = {
  icon: string;
  title: string;
};

export function ServiceCard({ icon, title }: ServiceCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.84} style={styles.card}>
      <View style={styles.iconBubble}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: healthColors.cream,
    borderColor: healthColors.olive,
    borderRadius: 22,
    borderWidth: 1,
    minHeight: 116,
    justifyContent: 'center',
    padding: 12,
    width: '31%',
  },
  iconBubble: {
    alignItems: 'center',
    backgroundColor: healthColors.night,
    borderRadius: 18,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  icon: {
    color: healthColors.cream,
    fontSize: 20,
    fontWeight: '900',
  },
  title: {
    color: healthColors.night,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 10,
    textAlign: 'center',
  },
});
