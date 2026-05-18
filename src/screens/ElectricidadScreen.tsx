import { ModulePlaceholder } from './ModulePlaceholder';

type ElectricidadScreenProps = {
  onBack: () => void;
};

export function ElectricidadScreen({ onBack }: ElectricidadScreenProps) {
  return (
    <ModulePlaceholder
      title="Servicio de Electricidad"
      subtitle="Presupuestos, materiales, instalaciones y trabajos electricos."
      welcome="Bienvenido Lucas"
      moduleSubtitle="Gestion de servicios electricos"
      accent="#F59E0B"
      icon="⚡"
      onBack={onBack}
    />
  );
}
