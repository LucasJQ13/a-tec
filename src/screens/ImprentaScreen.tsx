import { ModulePlaceholder } from './ModulePlaceholder';

type ImprentaScreenProps = {
  onBack: () => void;
};

export function ImprentaScreen({ onBack }: ImprentaScreenProps) {
  return (
    <ModulePlaceholder
      title="Servicio de Imprenta"
      subtitle="Disenos, impresiones, pedidos, costos y entregas."
      accent="#8f5cf7"
      icon="CMYK"
      onBack={onBack}
    />
  );
}
