import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { BottomNav } from './src/components/BottomNav';
import { ElectricidadScreen } from './src/screens/ElectricidadScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ImprentaScreen } from './src/screens/ImprentaScreen';
import { KinesiologiaScreen } from './src/screens/KinesiologiaScreen';
import { PlaceholderScreen } from './src/screens/PlaceholderScreen';
import type { AppScreen, AreaId, MainTabId } from './src/types/navigation';
import { healthColors } from './src/constants/healthTheme';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('home');
  const [activeTab, setActiveTab] = useState<MainTabId>('home');

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

  return (
    <SafeAreaView style={[styles.safeArea, activeScreen === 'kinesiologia' ? styles.healthSafeArea : null]}>
      <StatusBar style="dark" />
      <View style={[styles.appShell, activeScreen === 'kinesiologia' ? styles.healthShell : null]}>
        {activeScreen === 'home' ? <HomeScreen onOpenArea={openArea} /> : null}
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
          <BottomNav activeTab={activeTab} onChangeTab={openTab} />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#efe0ff',
    flex: 1,
  },
  healthSafeArea: {
    backgroundColor: healthColors.night,
  },
  appShell: {
    backgroundColor: '#f7efff',
    flex: 1,
  },
  healthShell: {
    backgroundColor: healthColors.cream,
  },
});
