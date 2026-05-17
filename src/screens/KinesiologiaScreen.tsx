import { ModulePlaceholder } from './ModulePlaceholder';

type KinesiologiaScreenProps = {
  onBack: () => void;
};

export function KinesiologiaScreen({ onBack }: KinesiologiaScreenProps) {
  return (
    <ModulePlaceholder
      title="Kinesiologia y Fisioterapia"
      subtitle="Pacientes, sesiones, turnos y tratamientos."
      accent="#36b7a0"
      icon="+"
      onBack={onBack}
    />
  );
}
