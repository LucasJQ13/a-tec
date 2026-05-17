import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { CalendarGrid } from '../components/kinesiologia/CalendarGrid';
import { HealthBottomNav } from '../components/kinesiologia/HealthBottomNav';
import { HealthHeader } from '../components/kinesiologia/HealthHeader';
import { ModuleTabs, type KinesiologyTab } from '../components/kinesiologia/ModuleTabs';
import { PatientCard } from '../components/kinesiologia/PatientCard';
import { PatientSearch } from '../components/kinesiologia/PatientSearch';
import { ServiceCard } from '../components/kinesiologia/ServiceCard';
import { TimeSlotGrid } from '../components/kinesiologia/TimeSlotGrid';
import { healthColors } from '../constants/healthTheme';
import {
  availableTimes,
  calendarDays,
  kinesiologyPatients,
  kinesiologyServices,
  profileSpecialties,
} from '../data/kinesiologiaMock';

type KinesiologiaScreenProps = {
  onBack: () => void;
};

export function KinesiologiaScreen({ onBack }: KinesiologiaScreenProps) {
  const [activeTab, setActiveTab] = useState<KinesiologyTab>('services');

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <HealthHeader onBack={onBack} />
        <ModuleTabs activeTab={activeTab} onChangeTab={setActiveTab} />

        {activeTab === 'services' ? <ServicesTab /> : null}
        {activeTab === 'dates' ? <DatesTab /> : null}
        {activeTab === 'profile' ? <ProfileTab /> : null}
      </ScrollView>
      <HealthBottomNav />
    </View>
  );
}

function ServicesTab() {
  return (
    <View style={styles.tabContent}>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Servicios</Text>
        <Text style={styles.sectionMeta}>Modulo salud</Text>
      </View>

      <View style={styles.serviceGrid}>
        {kinesiologyServices.map((service) => (
          <ServiceCard key={service.id} icon={service.icon} title={service.title} />
        ))}
      </View>

      <PatientSearch />

      <View style={styles.patientList}>
        {kinesiologyPatients.map((patient) => (
          <PatientCard
            key={patient.id}
            name={patient.name}
            nextSession={patient.nextSession}
            state={patient.state}
            initials={patient.initials}
          />
        ))}
      </View>
    </View>
  );
}

function DatesTab() {
  return (
    <View style={styles.tabContent}>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Agenda</Text>
        <Text style={styles.sectionMeta}>Noviembre</Text>
      </View>
      <CalendarGrid days={calendarDays} />
      <TimeSlotGrid times={availableTimes} />
    </View>
  );
}

function ProfileTab() {
  return (
    <View style={styles.tabContent}>
      <View style={styles.profileCard}>
        <View style={styles.profileTop}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>AT</Text>
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.profileTitle}>A-Tec Kinesiologia</Text>
            <Text style={styles.profileSubtitle}>Centro de atencion y seguimiento terapeutico</Text>
          </View>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Especialidades</Text>
          {profileSpecialties.map((specialty) => (
            <Text key={specialty} style={styles.infoItem}>{specialty}</Text>
          ))}
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Horarios de atencion</Text>
          <Text style={styles.infoItem}>Lunes a Viernes - 08:00 a 18:00</Text>
          <Text style={styles.infoItem}>Sabados - 09:00 a 13:00</Text>
        </View>

        <TouchableOpacity activeOpacity={0.84} style={styles.editButton}>
          <Text style={styles.editButtonText}>Editar perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: healthColors.cream,
    flex: 1,
  },
  content: {
    paddingBottom: 104,
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  sectionTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    color: healthColors.night,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
  },
  sectionMeta: {
    color: healthColors.olive,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  patientList: {
    marginTop: 4,
  },
  profileCard: {
    backgroundColor: healthColors.cream,
    borderColor: healthColors.olive,
    borderRadius: 28,
    borderWidth: 1,
    padding: 18,
  },
  profileTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  profileAvatar: {
    alignItems: 'center',
    backgroundColor: healthColors.night,
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  profileAvatarText: {
    color: healthColors.cream,
    fontSize: 18,
    fontWeight: '900',
  },
  profileCopy: {
    flex: 1,
  },
  profileTitle: {
    color: healthColors.night,
    fontSize: 19,
    fontWeight: '900',
  },
  profileSubtitle: {
    color: healthColors.olive,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    marginTop: 4,
  },
  infoBlock: {
    borderTopColor: healthColors.olive,
    borderTopWidth: 1,
    marginTop: 18,
    paddingTop: 16,
  },
  infoLabel: {
    color: healthColors.burgundy,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  infoItem: {
    color: healthColors.night,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 22,
  },
  editButton: {
    alignItems: 'center',
    backgroundColor: healthColors.night,
    borderRadius: 20,
    marginTop: 22,
    minHeight: 50,
    justifyContent: 'center',
  },
  editButtonText: {
    color: healthColors.cream,
    fontSize: 14,
    fontWeight: '900',
  },
});
