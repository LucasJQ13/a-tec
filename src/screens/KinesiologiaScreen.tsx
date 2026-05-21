import { BackHandler, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HealthBottomNav } from '../components/kinesiologia/HealthBottomNav';
import { HealthHeader } from '../components/kinesiologia/HealthHeader';
import { KinesiologiaCareWorkspace } from '../components/kinesiologia/KinesiologiaCareWorkspace';
import { ModuleTabs, type KinesiologyTab } from '../components/kinesiologia/ModuleTabs';
import { healthColors } from '../constants/healthTheme';
import { usePullRefresh } from '../shared/hooks/usePullRefresh';

type KinesiologiaScreenProps = {
  onBack: () => void;
};

export function KinesiologiaScreen({ onBack }: KinesiologiaScreenProps) {
  const [activeTab, setActiveTab] = useState<KinesiologyTab>('patients');
  const [workspaceFullScreen, setWorkspaceFullScreen] = useState(false);
  const tabHistory = useRef<KinesiologyTab[]>(['patients']);
  const { onRefresh, refreshing } = usePullRefresh();
  const insets = useSafeAreaInsets();

  const changeTab = (tab: KinesiologyTab) => {
    setWorkspaceFullScreen(false);
    setActiveTab(tab);
    tabHistory.current = [...tabHistory.current, tab].slice(-8);
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (tabHistory.current.length > 1) {
        tabHistory.current = tabHistory.current.slice(0, -1);
        setActiveTab(tabHistory.current[tabHistory.current.length - 1] ?? 'patients');
        return true;
      }

      onBack();
      return true;
    });

    return () => subscription.remove();
  }, [onBack]);

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: 104 + insets.bottom }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={healthColors.night}
            colors={[healthColors.night]}
            progressBackgroundColor="rgba(252, 244, 228, 0.9)"
          />
        }
      >
        {!workspaceFullScreen ? <HealthHeader onBack={onBack} /> : null}
        {!workspaceFullScreen ? <ModuleTabs activeTab={activeTab} onChangeTab={changeTab} /> : null}

        {activeTab === 'patients' ? <PatientsTab onFullScreenChange={setWorkspaceFullScreen} /> : null}
        {activeTab === 'history' ? <HistoryTab onFullScreenChange={setWorkspaceFullScreen} /> : null}
        {activeTab === 'dates' ? <DatesTab onFullScreenChange={setWorkspaceFullScreen} /> : null}
        {activeTab === 'profile' ? <ProfileTab onFullScreenChange={setWorkspaceFullScreen} /> : null}
      </ScrollView>
      <HealthBottomNav />
    </View>
  );
}

function PatientsTab({ onFullScreenChange }: { onFullScreenChange: (active: boolean) => void }) {
  return (
    <View style={styles.tabContent}>
      <KinesiologiaCareWorkspace mode="patients" onFullScreenChange={onFullScreenChange} />
    </View>
  );
}

function HistoryTab({ onFullScreenChange }: { onFullScreenChange: (active: boolean) => void }) {
  return (
    <View style={styles.tabContent}>
      <KinesiologiaCareWorkspace mode="history" onFullScreenChange={onFullScreenChange} />
    </View>
  );
}

function DatesTab({ onFullScreenChange }: { onFullScreenChange: (active: boolean) => void }) {
  return (
    <View style={styles.tabContent}>
      <KinesiologiaCareWorkspace mode="dates" onFullScreenChange={onFullScreenChange} />
    </View>
  );
}

function ProfileTab({ onFullScreenChange }: { onFullScreenChange: (active: boolean) => void }) {
  return (
    <View style={styles.tabContent}>
      <KinesiologiaCareWorkspace mode="profile" onFullScreenChange={onFullScreenChange} />
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
    paddingTop: 26,
  },
});
