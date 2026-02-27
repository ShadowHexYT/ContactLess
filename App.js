import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  AppState,
  Easing,
  Platform,
  Share,
  ScrollView,
  Settings,
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
const DEFAULT_PROFILE = {
  displayName: 'Your Name',
  username: '@yourname',
  email: 'you@example.com',
  phone: '+1 000 000 0000',
  profileImageUri: '',
  shareDescription: 'Let\'s connect on ContactLess.',
  themeId: 'ocean',
  isNfcEnabled: false,
};
const NOTES_STORAGE_KEY = 'contactless.notes';
const PREFS_STORAGE_KEY = 'contactless.prefs';
const THEME_PRESETS = [
  { id: 'ocean', label: 'Ocean', background: '#0d1726', card: '#13233a', accent: '#2d76f9' },
  { id: 'forest', label: 'Forest', background: '#0f2019', card: '#173126', accent: '#2fa36b' },
  { id: 'sunset', label: 'Sunset', background: '#271811', card: '#3a2218', accent: '#eb7a34' },
  { id: 'slate', label: 'Slate', background: '#1a1d24', card: '#232834', accent: '#6f8ec7' },
  { id: 'ember', label: 'Ember', background: '#22120f', card: '#341d17', accent: '#ff6a3d' },
  { id: 'mint', label: 'Mint', background: '#10201d', card: '#17302b', accent: '#34c49b' },
  { id: 'ruby', label: 'Ruby', background: '#251018', card: '#3a1925', accent: '#e34f7a' },
  { id: 'cobalt', label: 'Cobalt', background: '#101a2b', card: '#172740', accent: '#4f86ff' },
  { id: 'gold', label: 'Gold', background: '#261f10', card: '#3b3017', accent: '#f2b84a' },
  { id: 'ice', label: 'Ice', background: '#0f1d24', card: '#17303c', accent: '#66c6e8' },
  { id: 'orchard', label: 'Orchard', background: '#1b2110', card: '#2b3418', accent: '#9fce4e' },
  { id: 'rose', label: 'Rose', background: '#24131a', card: '#381d29', accent: '#f276a4' },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [displayName, setDisplayName] = useState(DEFAULT_PROFILE.displayName);
  const [username, setUsername] = useState(DEFAULT_PROFILE.username);
  const [email, setEmail] = useState(DEFAULT_PROFILE.email);
  const [phone, setPhone] = useState(DEFAULT_PROFILE.phone);
  const [profileImageUri, setProfileImageUri] = useState(DEFAULT_PROFILE.profileImageUri);
  const [shareDescription, setShareDescription] = useState(DEFAULT_PROFILE.shareDescription);
  const [themeId, setThemeId] = useState(DEFAULT_PROFILE.themeId);
  const [notes, setNotes] = useState([]);
  const [isNotesHydrated, setIsNotesHydrated] = useState(false);
  const [isPrefsHydrated, setIsPrefsHydrated] = useState(false);
  const [isNfcEnabled, setIsNfcEnabled] = useState(DEFAULT_PROFILE.isNfcEnabled);
  const [accounts, setAccounts] = useState(DEFAULT_ACCOUNTS);
  const screenAnim = useRef(new Animated.Value(1)).current;
  const latestNotesRef = useRef(notes);
  const latestPrefsRef = useRef({
    displayName,
    username,
    email,
    phone,
    profileImageUri,
    shareDescription,
    themeId,
    isNfcEnabled,
  });
  const canPersistNotes = Platform.OS === 'ios';
  const canPersistPrefs = Platform.OS === 'ios';
  const activeTheme = useMemo(
    () => THEME_PRESETS.find((item) => item.id === themeId) ?? THEME_PRESETS[0],
    [themeId]
  );

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

  const exportUserData = async () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile: {
        displayName,
        username,
        email,
        phone,
        profileImageUri,
        shareDescription,
        themeId,
        isNfcEnabled,
      },
      notes,
      accounts,
    };

    await Share.share({
      title: 'ContactLess User Data',
      subject: 'ContactLess User Data Export',
      message: JSON.stringify(payload, null, 2),
    });
  };

  const deleteAllUserData = () => {
    setDisplayName(DEFAULT_PROFILE.displayName);
    setUsername(DEFAULT_PROFILE.username);
    setEmail(DEFAULT_PROFILE.email);
    setPhone(DEFAULT_PROFILE.phone);
    setProfileImageUri(DEFAULT_PROFILE.profileImageUri);
    setShareDescription(DEFAULT_PROFILE.shareDescription);
    setThemeId(DEFAULT_PROFILE.themeId);
    setIsNfcEnabled(DEFAULT_PROFILE.isNfcEnabled);
    setNotes([]);
    setAccounts(DEFAULT_ACCOUNTS);
    persistNotes([]);
    persistPrefs(DEFAULT_PROFILE);
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

  useEffect(() => {
    latestNotesRef.current = notes;
  }, [notes]);

  useEffect(() => {
    latestPrefsRef.current = {
      displayName,
      username,
      email,
      phone,
      profileImageUri,
      shareDescription,
      themeId,
      isNfcEnabled,
    };
  }, [displayName, username, email, phone, profileImageUri, shareDescription, themeId, isNfcEnabled]);

  const persistNotes = (nextNotes) => {
    if (!canPersistNotes) {
      return;
    }

    try {
      Settings.set({ [NOTES_STORAGE_KEY]: JSON.stringify(nextNotes) });
    } catch (error) {
      console.warn('Unable to save notes:', error);
    }
  };

  const persistPrefs = (nextPrefs) => {
    if (!canPersistPrefs) {
      return;
    }

    try {
      Settings.set({ [PREFS_STORAGE_KEY]: JSON.stringify(nextPrefs) });
    } catch (error) {
      console.warn('Unable to save app preferences:', error);
    }
  };

  useEffect(() => {
    if (!canPersistNotes) {
      setIsNotesHydrated(true);
      return;
    }

    try {
      const saved = Settings.get(NOTES_STORAGE_KEY);
      if (typeof saved === 'string') {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setNotes(parsed);
        }
      }
    } catch (error) {
      console.warn('Unable to load saved notes:', error);
    } finally {
      setIsNotesHydrated(true);
    }
  }, [canPersistNotes]);

  useEffect(() => {
    if (!isNotesHydrated) {
      return;
    }

    persistNotes(notes);
  }, [isNotesHydrated, notes]);

  useEffect(() => {
    if (!canPersistPrefs) {
      setIsPrefsHydrated(true);
      return;
    }

    try {
      const saved = Settings.get(PREFS_STORAGE_KEY);
      if (typeof saved === 'string') {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          if (typeof parsed.displayName === 'string') {
            setDisplayName(parsed.displayName);
          }
          if (typeof parsed.username === 'string') {
            setUsername(parsed.username);
          }
          if (typeof parsed.email === 'string') {
            setEmail(parsed.email);
          }
          if (typeof parsed.phone === 'string') {
            setPhone(parsed.phone);
          }
          if (typeof parsed.profileImageUri === 'string') {
            setProfileImageUri(parsed.profileImageUri);
          }
          if (typeof parsed.shareDescription === 'string') {
            setShareDescription(parsed.shareDescription);
          }
          if (
            typeof parsed.themeId === 'string' &&
            THEME_PRESETS.some((item) => item.id === parsed.themeId)
          ) {
            setThemeId(parsed.themeId);
          }
          if (typeof parsed.isNfcEnabled === 'boolean') {
            setIsNfcEnabled(parsed.isNfcEnabled);
          }
        }
      }
    } catch (error) {
      console.warn('Unable to load app preferences:', error);
    } finally {
      setIsPrefsHydrated(true);
    }
  }, [canPersistPrefs]);

  useEffect(() => {
    if (!isPrefsHydrated) {
      return;
    }

    persistPrefs({
      displayName,
      username,
      email,
      phone,
      profileImageUri,
      shareDescription,
      themeId,
      isNfcEnabled,
    });
  }, [
    displayName,
    username,
    email,
    phone,
    profileImageUri,
    shareDescription,
    themeId,
    isNfcEnabled,
    isPrefsHydrated,
  ]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'inactive' || nextState === 'background') {
        persistNotes(latestNotesRef.current);
        persistPrefs(latestPrefsRef.current);
      }
    });

    return () => {
      sub.remove();
    };
  }, []);

  const renderScreen = () => {
    if (activeScreen === 'home') {
      return (
        <HomeScreen
          displayName={displayName}
          username={username}
          email={email}
          phone={phone}
          stats={homeStats}
          theme={activeTheme}
        />
      );
    }

    if (activeScreen === 'connections') {
      return (
        <ConnectionsScreen
          accounts={accounts}
          connectedCount={connectedCount}
          onToggleAccount={toggleAccount}
          theme={activeTheme}
        />
      );
    }

    if (activeScreen === 'notes') {
      return <NotesScreen notes={notes} onChangeNotes={setNotes} theme={activeTheme} />;
    }

    if (activeScreen === 'share') {
      return (
        <ShareScreen
          displayName={displayName}
          username={username}
          email={email}
          phone={phone}
          isNfcEnabled={isNfcEnabled}
          profileImageUri={profileImageUri}
          shareDescription={shareDescription}
          theme={activeTheme}
        />
      );
    }

    return (
      <SettingsScreen
        displayName={displayName}
        onChangeDisplayName={setDisplayName}
        username={username}
        onChangeUsername={setUsername}
        email={email}
        onChangeEmail={setEmail}
        phone={phone}
        onChangePhone={setPhone}
        isNfcEnabled={isNfcEnabled}
        onToggleNfc={setIsNfcEnabled}
        profileImageUri={profileImageUri}
        onChangeProfileImageUri={setProfileImageUri}
        shareDescription={shareDescription}
        onChangeShareDescription={setShareDescription}
        themeId={themeId}
        themePresets={THEME_PRESETS}
        onChangeThemeId={setThemeId}
        theme={activeTheme}
        onExportUserData={exportUserData}
        onDeleteUserData={deleteAllUserData}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: activeTheme.background }]}>
        <StatusBar barStyle="light-content" />
        <View style={[styles.container, { backgroundColor: activeTheme.background }]}>
          <Text style={styles.headerTitle}>ContactLess</Text>
          <Text style={[styles.headerSubtitle, { color: activeTheme.accent }]}>
            NFC Contact Share Baseline
          </Text>

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

          <BottomNav activeScreen={activeScreen} onChange={setActiveScreen} theme={activeTheme} />
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
