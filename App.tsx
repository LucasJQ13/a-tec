import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FloatingDockNav } from './src/components/FloatingDockNav';
import { homeColors } from './src/config/theme.config';
import { ElectricidadScreen } from './src/screens/ElectricidadScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ImprentaScreen } from './src/screens/ImprentaScreen';
import { KinesiologiaScreen } from './src/screens/KinesiologiaScreen';
import { PlaceholderScreen } from './src/screens/PlaceholderScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { WelcomeUserScreen } from './src/screens/WelcomeUserScreen';
import type { AreaId, MainTabId, RootStackParamList, UserProfile } from './src/types/navigation';

type AppFlowStep = 'splash' | 'welcome' | 'main';

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

function tabForRoute(routeName: keyof RootStackParamList): MainTabId {
  if (routeName === 'Clients') return 'clients';
  if (routeName === 'Reports') return 'reports';
  if (routeName === 'Settings') return 'settings';
  return 'home';
}

function routeForArea(area: AreaId): keyof RootStackParamList {
  if (area === 'electricidad') return 'Electricidad';
  if (area === 'kinesiologia') return 'Kinesiologia';
  return 'Imprenta';
}

function routeForTab(tab: MainTabId): keyof RootStackParamList {
  if (tab === 'clients') return 'Clients';
  if (tab === 'reports') return 'Reports';
  if (tab === 'settings') return 'Settings';
  return 'Home';
}

type MainNavigatorProps = {
  onBackToUsers: () => void;
  selectedUser: UserProfile | null;
};

function MainNavigator({ onBackToUsers, selectedUser }: MainNavigatorProps) {
  const [activeTab, setActiveTab] = useState<MainTabId>('home');
  const [activeRoute, setActiveRoute] = useState<keyof RootStackParamList>('Home');

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={(state) => {
        const route = state?.routes[state.index ?? 0]?.name as keyof RootStackParamList | undefined;
        if (route) {
          setActiveRoute(route);
          setActiveTab(tabForRoute(route));
        }
      }}
    >
      <View style={styles.navigatorShell}>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="Home">
            {({ navigation }) => (
              <HomeScreen
                selectedUser={selectedUser}
                onBackToUsers={onBackToUsers}
                onOpenArea={(area) => navigation.navigate(routeForArea(area))}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Electricidad">
            {({ navigation }) => <ElectricidadScreen onBack={() => navigation.goBack()} />}
          </Stack.Screen>
          <Stack.Screen name="Kinesiologia">
            {({ navigation }) => <KinesiologiaScreen onBack={() => navigation.goBack()} />}
          </Stack.Screen>
          <Stack.Screen name="Imprenta">
            {({ navigation }) => <ImprentaScreen onBack={() => navigation.goBack()} />}
          </Stack.Screen>
          <Stack.Screen name="Clients">
            {() => (
              <PlaceholderScreen
                title="Clientes"
                subtitle="Listado, busqueda y ficha de clientes se desarrollaran en otro bloque."
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Reports">
            {() => (
              <PlaceholderScreen
                title="Reportes"
                subtitle="Resumenes simples y metricas visuales se sumaran despues de los modulos base."
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Settings">
            {() => (
              <PlaceholderScreen
                title="Ajustes"
                subtitle="Datos de A-Tec, preferencias visuales y configuracion general."
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>

        {['Home', 'Clients', 'Reports', 'Settings'].includes(activeRoute) ? (
          <FloatingDockNav
            activeTab={activeTab}
            onChangeTab={(tab) => {
              setActiveTab(tab);
              const route = routeForTab(tab);
              if (navigationRef.isReady()) {
                navigationRef.navigate(route);
              }
            }}
          />
        ) : null}
      </View>
    </NavigationContainer>
  );
}

export default function App() {
  const [flowStep, setFlowStep] = useState<AppFlowStep>('splash');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFlowStep('welcome');
    }, 1900);

    return () => clearTimeout(timer);
  }, []);

  const selectUser = (user: UserProfile) => {
    setSelectedUser(user);
    setFlowStep('main');
  };

  const backToUserSelection = () => {
    setSelectedUser(null);
    setFlowStep('welcome');
  };

  return (
    <SafeAreaProvider>
      <StatusBar translucent backgroundColor="transparent" style={flowStep === 'main' ? 'light' : 'light'} />
      {flowStep === 'splash' ? <SplashScreen /> : null}
      {flowStep === 'welcome' ? <WelcomeUserScreen onSelectUser={selectUser} /> : null}
      {flowStep === 'main' ? <MainNavigator selectedUser={selectedUser} onBackToUsers={backToUserSelection} /> : null}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  navigatorShell: {
    backgroundColor: homeColors.background,
    flex: 1,
  },
});
