import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { FloatingDockNav } from './src/components/FloatingDockNav';
import { academicTheme, homeColors } from './src/config/theme.config';
import { ElectricidadScreen } from './src/screens/ElectricidadScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ImprentaScreen } from './src/screens/ImprentaScreen';
import { KinesiologiaScreen } from './src/screens/KinesiologiaScreen';
import { PlaceholderScreen } from './src/screens/PlaceholderScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { WelcomeUserScreen } from './src/screens/WelcomeUserScreen';
import type { AppScreen, AreaId, MainTabId, UserProfile } from './src/types/navigation';
import { healthColors } from './src/constants/healthTheme';

type AppFlowStep = 'splash' | 'welcome' | 'main';

export default function App() {
  const [flowStep, setFlowStep] = useState<AppFlowStep>('splash');
  const [activeScreen, setActiveScreen] = useState<AppScreen>('home');
  const [activeTab, setActiveTab] = useState<MainTabId>('home');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFlowStep('welcome');
    }, 1900);

    return () => clearTimeout(timer);
  }, []);

  const openArea = (area: AreaId) => {
    setActiveScreen(area);
  };

  const openTab = (tab: MainTabId) => {
    setActiveTab(tab);
    setActiveScreen(tab);
  };

  const backHome = () => {
    setActiveTab('home');
    setActiveScreen('home');
  };

  const selectUser = (user: UserProfile) => {
    setSelectedUser(user);
    setActiveTab('home');
    setActiveScreen('home');
    setFlowStep('main');
  };

  if (flowStep === 'splash') {
    return (
      <SafeAreaView style={styles.darkSafeArea}>
        <StatusBar style="light" />
        <SplashScreen />
      </SafeAreaView>
    );
  }

  if (flowStep === 'welcome') {
    return (
      <SafeAreaView style={styles.darkSafeArea}>
        <StatusBar style="light" />
        <WelcomeUserScreen onSelectUser={selectUser} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, activeScreen === 'kinesiologia' ? styles.healthSafeArea : null]}>
      <StatusBar style={activeScreen === 'home' ? 'light' : 'dark'} />
      <View style={[styles.appShell, activeScreen === 'kinesiologia' ? styles.healthShell : null]}>
        {activeScreen === 'home' ? <HomeScreen onOpenArea={openArea} selectedUser={selectedUser} /> : null}
        {activeScreen === 'electricidad' ? <ElectricidadScreen onBack={backHome} /> : null}
        {activeScreen === 'kinesiologia' ? <KinesiologiaScreen onBack={backHome} /> : null}
        {activeScreen === 'imprenta' ? <ImprentaScreen onBack={backHome} /> : null}
        {activeScreen === 'clients' ? (
          <PlaceholderScreen
            title="Clientes"
            subtitle="Listado, busqueda y ficha de clientes se desarrollaran en otro bloque."
          />
        ) : null}
        {activeScreen === 'reports' ? (
          <PlaceholderScreen
            title="Reportes"
            subtitle="Resumenes simples y metricas visuales se sumaran despues de los modulos base."
          />
        ) : null}
        {activeScreen === 'settings' ? (
          <PlaceholderScreen
            title="Ajustes"
            subtitle="Datos de A-Tec, preferencias visuales y configuracion general."
          />
        ) : null}

        {['home', 'clients', 'reports', 'settings'].includes(activeScreen) ? (
          <FloatingDockNav activeTab={activeTab} onChangeTab={openTab} />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  darkSafeArea: {
    backgroundColor: academicTheme.colors.night,
    flex: 1,
  },
  safeArea: {
    backgroundColor: homeColors.primary,
    flex: 1,
  },
  healthSafeArea: {
    backgroundColor: healthColors.night,
  },
  appShell: {
    backgroundColor: homeColors.background,
    flex: 1,
  },
  healthShell: {
    backgroundColor: healthColors.cream,
  },
});
