import { ScrollView, StyleSheet } from 'react-native';
import { ModuleSquareCard } from './ModuleSquareCard';
import type { AreaId, ModuleConfig } from '../types/navigation';

type HorizontalModuleRailProps = {
  modules: ModuleConfig[];
  onOpenArea: (area: AreaId) => void;
};

export function HorizontalModuleRail({ modules, onOpenArea }: HorizontalModuleRailProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
      {modules.map((module) => (
        <ModuleSquareCard key={module.id} module={module} onPress={() => onOpenArea(module.id)} />
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
