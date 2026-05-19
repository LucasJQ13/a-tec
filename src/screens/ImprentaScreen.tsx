import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ImprentaScreenProps = {
  onBack: () => void;
};

const printColors = {
  background: '#FBF7FF',
  surface: '#ffffff',
  primary: '#6D35C6',
  cyan: '#00AFC7',
  magenta: '#E45BA6',
  yellow: '#F3C94A',
  text: '#2A183D',
  muted: '#756887',
  border: '#E8DDF8',
};

const printAccess = [
  { id: 'clients', label: 'Clientes', caption: 'Base comercial', color: printColors.primary },
  { id: 'orders', label: 'Pedidos', caption: 'Produccion grafica', color: printColors.magenta },
  { id: 'services', label: 'Servicios', caption: 'Diseno e impresion', color: printColors.cyan },
  { id: 'quotes', label: 'Presupuestos', caption: 'Costos y entregas', color: printColors.yellow },
];

export function ImprentaScreen({ onBack }: ImprentaScreenProps) {
  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity activeOpacity={0.82} onPress={onBack} style={styles.backButton}>
              <Text style={styles.backText}>A-Tec</Text>
            </TouchableOpacity>
            <View style={styles.colorDots}>
              <View style={[styles.dot, { backgroundColor: printColors.cyan }]} />
              <View style={[styles.dot, { backgroundColor: printColors.magenta }]} />
              <View style={[styles.dot, { backgroundColor: printColors.yellow }]} />
            </View>
          </View>

          <Text style={styles.kicker}>Servicio de Imprenta</Text>
          <Text style={styles.welcome}>Bienvenidos Fer y Lucas</Text>
          <Text style={styles.subtitle}>Gestion de servicios de imprenta</Text>
        </View>

        <View style={styles.productionPanel}>
          <View>
            <Text style={styles.panelLabel}>Produccion grafica</Text>
            <Text style={styles.panelTitle}>Diseno, impresion y pedidos en una vista.</Text>
          </View>
          <View style={styles.panelMark}>
            <Text style={styles.panelMarkText}>CMYK</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Accesos del modulo</Text>
          <Text style={styles.sectionHint}>Preparado para clientes, pedidos y presupuestos</Text>
        </View>

        <View style={styles.accessGrid}>
          {printAccess.map((item) => (
            <TouchableOpacity activeOpacity={0.84} key={item.id} style={styles.accessCard}>
              <View style={[styles.accessIcon, { backgroundColor: item.color }]}>
                <Text style={styles.accessIconText}>{item.label.slice(0, 2).toUpperCase()}</Text>
              </View>
              <Text style={styles.accessTitle}>{item.label}</Text>
              <Text style={styles.accessCaption}>{item.caption}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Modulo visual listo</Text>
          <Text style={styles.noteText}>
            La funcionalidad real se conectara despues reutilizando la misma base compartida de contactos,
            servicios y presupuestos.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: printColors.background,
    flex: 1,
  },
  content: {
    paddingBottom: 34,
  },
  header: {
    backgroundColor: printColors.primary,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    paddingBottom: 28,
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  headerTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    borderColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  backText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  colorDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    borderRadius: 7,
    height: 14,
    width: 14,
  },
  kicker: {
    color: '#EBDDFF',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 28,
    textTransform: 'uppercase',
  },
  welcome: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 34,
    marginTop: 10,
  },
  subtitle: {
    color: '#F4ECFF',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
    marginTop: 8,
  },
  productionPanel: {
    alignItems: 'center',
    backgroundColor: printColors.surface,
    borderColor: printColors.border,
    borderRadius: 26,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginTop: -22,
    padding: 18,
    shadowColor: printColors.primary,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  panelLabel: {
    color: printColors.magenta,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  panelTitle: {
    color: printColors.text,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 23,
    marginTop: 6,
    maxWidth: 230,
  },
  panelMark: {
    alignItems: 'center',
    backgroundColor: printColors.cyan,
    borderRadius: 18,
    height: 52,
    justifyContent: 'center',
    width: 62,
  },
  panelMarkText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  sectionHeader: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: printColors.text,
    fontSize: 21,
    fontWeight: '900',
  },
  sectionHint: {
    color: printColors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 4,
  },
  accessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 14,
    paddingHorizontal: 18,
  },
  accessCard: {
    backgroundColor: printColors.surface,
    borderColor: printColors.border,
    borderRadius: 22,
    borderWidth: 1,
    minHeight: 132,
    padding: 14,
    width: '48%',
  },
  accessIcon: {
    alignItems: 'center',
    borderRadius: 17,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  accessIconText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  accessTitle: {
    color: printColors.text,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 14,
  },
  accessCaption: {
    color: printColors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 4,
  },
  noteCard: {
    backgroundColor: printColors.surface,
    borderColor: printColors.border,
    borderRadius: 24,
    borderWidth: 1,
    marginHorizontal: 18,
    marginTop: 18,
    padding: 18,
  },
  noteTitle: {
    color: printColors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  noteText: {
    color: printColors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 8,
  },
});
