import { ModulePlaceholder } from './ModulePlaceholder';

type ImprentaScreenProps = {
  onBack: () => void;
};

export function ImprentaScreen({ onBack }: ImprentaScreenProps) {
  return (
    <ModulePlaceholder
      title="Servicio de Imprenta"
      subtitle="Disenos, impresiones, pedidos, costos y entregas."
      welcome="Bienvenidos Fer y Lucas"
      moduleSubtitle="Gestion de servicios de imprenta"
      accent="#B15CFF"
      icon="▣"
      onBack={onBack}
    />
  );
}
