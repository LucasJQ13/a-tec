import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { ModuleSquareCard } from './ModuleSquareCard';
import type { AreaId, ModuleConfig } from '../types/navigation';

type HorizontalModuleRailProps = {
  modules: ModuleConfig[];
  onOpenArea: (area: AreaId) => void;
};

export function HorizontalModuleRail({ modules, onOpenArea }: HorizontalModuleRailProps) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.max(148, Math.min(width * 0.42, 180));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
      {modules.map((module) => (
        <ModuleSquareCard key={module.id} module={module} onPress={() => onOpenArea(module.id)} size={cardWidth} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingLeft: 18,
    paddingRight: 2,
    paddingVertical: 4,
  },
});
