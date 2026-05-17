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
      moduleSubtitle="Gestión de servicios eléctricos"
      accent="#f5a524"
      icon="E"
      onBack={onBack}
    />
  );
}
