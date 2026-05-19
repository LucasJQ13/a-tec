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
      accent="#3e5bb8"
      secondaryAccent="#f7651b"
      backgroundColor="#F3F6FF"
      surfaceColor="#ffffff"
      textColor="#17306F"
      icon="EL"
      onBack={onBack}
    />
  );
}
