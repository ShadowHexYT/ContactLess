import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from './src/components/BottomNav';
import ConnectionsScreen from './src/screens/ConnectionsScreen';
import HomeScreen from './src/screens/HomeScreen';
import NotesScreen from './src/screens/NotesScreen';
import ShareScreen from './src/screens/ShareScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const DEFAULT_ACCOUNTS = [
  { id: 'google', label: 'Google Contacts', connected: false },
  { id: 'icloud', label: 'Apple iCloud', connected: false },
  { id: 'outlook', label: 'Microsoft Outlook', connected: false },
];

const RECENT_SHARES = [
  { id: 'r1', name: 'Avery Chen', method: 'NFC', timeAgo: '5m ago' },
  { id: 'r2', name: 'Jordan Kim', method: 'QR', timeAgo: '22m ago' },
  { id: 'r3', name: 'Mia Patel', method: 'Link', timeAgo: '1h ago' },
  { id: 'r4', name: 'Noah Brooks', method: 'NFC', timeAgo: '3h ago' },
];

const HOTFIX_LIST = [
  { id: 'h1', title: 'iOS handoff retry fix', status: 'Shipped' },
  { id: 'h2', title: 'Contact card truncation patch', status: 'Shipped' },
  { id: 'h3', title: 'QR scan latency reduction', status: 'In QA' },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [displayName, setDisplayName] = useState('Your Name');
  const [email, setEmail] = useState('you@example.com');
  const [phone, setPhone] = useState('+1 000 000 0000');
  const [notes, setNotes] = useState('Add personal notes or quick reminders here.');
  const [isNfcEnabled, setIsNfcEnabled] = useState(false);
  const [accounts, setAccounts] = useState(DEFAULT_ACCOUNTS);
  const screenAnim = useRef(new Animated.Value(1)).current;

  const connectedCount = useMemo(
    () => accounts.filter((item) => item.connected).length,
    [accounts]
  );
  const homeStats = useMemo(
    () => ({
      totalPeopleShared: 182,
      todayShares: 14,
      weeklyGoalPercent: 70,
      shareSuccessRate: 98.6,
      activeStreakDays: 9,
      connectedProviders: connectedCount,
      hotfixCount: HOTFIX_LIST.length,
      deployedToday: 2,
      recentShares: RECENT_SHARES,
      hotfixList: HOTFIX_LIST,
    }),
    [connectedCount]
  );

  const toggleAccount = (id) => {
    setAccounts((current) =>
      current.map((item) =>
        item.id === id ? { ...item, connected: !item.connected } : item
      )
    );
  };

  useEffect(() => {
    screenAnim.setValue(0);
    Animated.timing(screenAnim, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeScreen, screenAnim]);

  const renderScreen = () => {
    if (activeScreen === 'home') {
      return (
        <HomeScreen
          displayName={displayName}
          email={email}
          phone={phone}
          stats={homeStats}
        />
      );
    }

    if (activeScreen === 'connections') {
      return (
        <ConnectionsScreen
          accounts={accounts}
          connectedCount={connectedCount}
          onToggleAccount={toggleAccount}
        />
      );
    }

    if (activeScreen === 'notes') {
      return <NotesScreen notes={notes} onChangeNotes={setNotes} />;
    }

    if (activeScreen === 'share') {
      return (
        <ShareScreen
          displayName={displayName}
          email={email}
          phone={phone}
          isNfcEnabled={isNfcEnabled}
        />
      );
    }

    return (
      <SettingsScreen
        displayName={displayName}
        onChangeDisplayName={setDisplayName}
        email={email}
        onChangeEmail={setEmail}
        phone={phone}
        onChangePhone={setPhone}
        isNfcEnabled={isNfcEnabled}
        onToggleNfc={setIsNfcEnabled}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
          <Text style={styles.headerTitle}>ContactLess</Text>
          <Text style={styles.headerSubtitle}>NFC Contact Share Baseline</Text>

          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            <Animated.View
              style={{
                opacity: screenAnim,
                transform: [
                  {
                    translateY: screenAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [6, 0],
                    }),
                  },
                ],
              }}
            >
              {renderScreen()}
            </Animated.View>
          </ScrollView>

          <BottomNav activeScreen={activeScreen} onChange={setActiveScreen} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d1726',
  },
  container: {
    flex: 1,
    backgroundColor: '#0d1726',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerTitle: {
    color: '#f2f7ff',
    fontSize: 28,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#b0c0d9',
    marginTop: 4,
    marginBottom: 12,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 18,
  },
});
