import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Alert,
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
const CONNECTION_SUGGESTIONS = [
  { id: 'spotify', label: 'Spotify' },
  { id: 'snapchat', label: 'Snapchat' },
  { id: 'apple-music', label: 'Apple Music' },
  { id: 'pinterest', label: 'Pinterest' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'x', label: 'X' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'discord', label: 'Discord' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'github', label: 'GitHub' },
];

const RECENT_SHARES = [
  { id: 'r1', name: 'Avery Chen', method: 'NFC', timeAgo: '5m ago' },
  { id: 'r2', name: 'Jordan Kim', method: 'QR', timeAgo: '22m ago' },
  { id: 'r3', name: 'Mia Patel', method: 'Link', timeAgo: '1h ago' },
  { id: 'r4', name: 'Noah Brooks', method: 'NFC', timeAgo: '3h ago' },
];
const SHARED_ACTIVITY = [
  {
    id: 's1',
    name: 'Avery Chen',
    direction: 'received',
    method: 'NFC',
    timeAgo: '5m ago',
    username: '@averychen',
    email: 'avery.chen@example.com',
    phone: '+1 415 555 0182',
    bio: 'Product designer and weekend climber.',
    photoUri: '',
    links: [
      { app: 'LinkedIn', handle: 'avery-chen', profile: 'linkedin.com/in/avery-chen' },
      { app: 'Instagram', handle: '@avery.chen', profile: 'instagram.com/avery.chen' },
    ],
  },
  {
    id: 's2',
    name: 'Jordan Kim',
    direction: 'sent',
    method: 'QR',
    timeAgo: '22m ago',
    username: '@jordankim',
    email: 'jordan.kim@example.com',
    phone: '+1 646 555 0133',
    bio: 'Growth lead. Coffee chat friendly.',
    photoUri: '',
    links: [
      { app: 'X', handle: '@jordankim', profile: 'x.com/jordankim' },
      { app: 'GitHub', handle: 'jordankim', profile: 'github.com/jordankim' },
    ],
  },
  {
    id: 's3',
    name: 'Mia Patel',
    direction: 'received',
    method: 'Link',
    timeAgo: '1h ago',
    username: '@miapatel',
    email: 'mia.patel@example.com',
    phone: '+1 312 555 0199',
    bio: 'Marketing strategist and podcast host.',
    photoUri: '',
    links: [
      { app: 'Spotify', handle: '@miapatel', profile: 'open.spotify.com/user/miapatel' },
      { app: 'Pinterest', handle: '@miapatel', profile: 'pinterest.com/miapatel' },
    ],
  },
  {
    id: 's4',
    name: 'Noah Brooks',
    direction: 'sent',
    method: 'NFC',
    timeAgo: '3h ago',
    username: '@noahbrooks',
    email: 'noah.brooks@example.com',
    phone: '+1 917 555 0121',
    bio: 'Engineer building mobile automation tools.',
    photoUri: '',
    links: [
      { app: 'GitHub', handle: 'noahbrooks', profile: 'github.com/noahbrooks' },
      { app: 'YouTube', handle: '@noahbrooks', profile: 'youtube.com/@noahbrooks' },
    ],
  },
  {
    id: 's5',
    name: 'Elena Rivera',
    direction: 'received',
    method: 'QR',
    timeAgo: 'Yesterday',
    username: '@elena.rivera',
    email: 'elena.rivera@example.com',
    phone: '+1 206 555 0117',
    bio: 'Creative director focused on brand systems.',
    photoUri: '',
    links: [
      { app: 'Instagram', handle: '@elena.rivera', profile: 'instagram.com/elena.rivera' },
      { app: 'Apple Music', handle: '@elena.rivera', profile: 'music.apple.com/profile/elena.rivera' },
    ],
  },
  {
    id: 's6',
    name: 'Marcus Reed',
    direction: 'received',
    method: 'Link',
    timeAgo: '2d ago',
    username: '@marcusreed',
    email: 'marcus.reed@example.com',
    phone: '+1 512 555 0176',
    bio: 'Startup advisor and former founder.',
    photoUri: '',
    links: [
      { app: 'LinkedIn', handle: 'marcus-reed', profile: 'linkedin.com/in/marcus-reed' },
      { app: 'Snapchat', handle: '@marcusreed', profile: 'snapchat.com/add/marcusreed' },
    ],
  },
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
  isAirDropEnabled: false,
  sharedContacts: [],
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
  { id: 'black-gold', label: 'Black Gold', background: '#090909', card: '#141414', accent: '#d4af37' },
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
  const [sharedContacts, setSharedContacts] = useState(DEFAULT_PROFILE.sharedContacts);
  const [notes, setNotes] = useState([]);
  const [isNotesHydrated, setIsNotesHydrated] = useState(false);
  const [isPrefsHydrated, setIsPrefsHydrated] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [isNfcEnabled, setIsNfcEnabled] = useState(DEFAULT_PROFILE.isNfcEnabled);
  const [isAirDropEnabled, setIsAirDropEnabled] = useState(DEFAULT_PROFILE.isAirDropEnabled);
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
    isAirDropEnabled,
    sharedContacts,
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

  const linkAccount = (id) => {
    setAccounts((current) =>
      current.map((item) =>
        item.id === id ? { ...item, connected: true } : item
      )
    );
  };
  const addSuggestedAccount = (suggestedAccount) => {
    if (!suggestedAccount?.id || !suggestedAccount?.label) {
      return;
    }

    setAccounts((current) => {
      const alreadyExists = current.some((item) => item.id === suggestedAccount.id);
      if (alreadyExists) {
        return current;
      }

      return [
        ...current,
        { id: suggestedAccount.id, label: suggestedAccount.label, connected: false },
      ];
    });
  };
  const removeAccount = (id) => {
    setAccounts((current) => current.filter((item) => item.id !== id));
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
        isAirDropEnabled,
      },
      notes,
      sharedContacts,
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
    setIsAirDropEnabled(DEFAULT_PROFILE.isAirDropEnabled);
    setSharedContacts(DEFAULT_PROFILE.sharedContacts);
    setNotes([]);
    setAccounts(DEFAULT_ACCOUNTS);
    setIsReturningUser(false);
    persistNotes([]);
    persistPrefs(DEFAULT_PROFILE);
  };

  const askForAppConsent = (title, message) =>
    new Promise((resolve) => {
      Alert.alert(title, message, [
        { text: 'Not Now', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Allow', onPress: () => resolve(true) },
      ]);
    });

  const requestNfcPermission = async (nextValue) => {
    if (!nextValue) {
      setIsNfcEnabled(false);
      return;
    }

    const nfcConsent = await askForAppConsent(
      'Allow NFC Sharing',
      'ContactLess needs NFC access to share imported contacts by tap.'
    );
    if (!nfcConsent) {
      setIsNfcEnabled(false);
      return;
    }

    let nativeNfcAvailable = false;
    try {
      const nfcModule = await import('react-native-nfc-manager');
      const NfcManager = nfcModule.default ?? nfcModule;
      if (NfcManager?.start) {
        await NfcManager.start();
        nativeNfcAvailable = true;
      }
    } catch (error) {
      nativeNfcAvailable = false;
    }

    if (!nativeNfcAvailable) {
      Alert.alert(
        'NFC Unavailable',
        'NFC permissions are not available in this build. Install and configure NFC native module in a dev build.'
      );
      setIsNfcEnabled(false);
      return;
    }

    setIsNfcEnabled(true);
  };

  const requestAirDropPermission = async (nextValue) => {
    if (!nextValue) {
      setIsAirDropEnabled(false);
      return;
    }

    const airDropConsent = await askForAppConsent(
      'Allow AirDrop/Wi-Fi Sharing',
      'ContactLess uses the iOS share sheet for AirDrop/Wi-Fi based sharing.'
    );
    if (!airDropConsent) {
      setIsAirDropEnabled(false);
      return;
    }

    setIsAirDropEnabled(true);
  };

  const importContactsFromPhone = async () => {
    try {
      const Contacts = await import('expo-contacts');
      const permission = await Contacts.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission needed', 'Allow Contacts access to import phone contacts.');
        return;
      }

      const result = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      const imported = (result.data ?? [])
        .map((contact) => {
          const firstNumber = contact.phoneNumbers?.[0]?.number?.trim();
          if (!firstNumber) {
            return null;
          }

          return {
            id: contact.id,
            name: contact.name?.trim() || 'Unnamed Contact',
            phone: firstNumber,
          };
        })
        .filter(Boolean);

      setSharedContacts(imported);
      Alert.alert(
        'Contacts Imported',
        imported.length > 0
          ? `${imported.length} contact${imported.length === 1 ? '' : 's'} ready to share.`
          : 'No contacts with phone numbers were found.'
      );
    } catch (error) {
      Alert.alert(
        'Import unavailable',
        'Contacts import is not available yet. Install dependencies and restart the app.'
      );
    }
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
      isAirDropEnabled,
      sharedContacts,
    };
  }, [
    displayName,
    username,
    email,
    phone,
    profileImageUri,
    shareDescription,
    themeId,
    isNfcEnabled,
    isAirDropEnabled,
    sharedContacts,
  ]);

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
        setIsReturningUser(true);
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
          if (typeof parsed.isAirDropEnabled === 'boolean') {
            setIsAirDropEnabled(parsed.isAirDropEnabled);
          }
          if (Array.isArray(parsed.sharedContacts)) {
            setSharedContacts(parsed.sharedContacts);
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
      isAirDropEnabled,
      sharedContacts,
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
    isAirDropEnabled,
    sharedContacts,
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
          isReturningUser={isReturningUser}
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
          onLinkAccount={linkAccount}
          onDeleteAccount={removeAccount}
          suggestions={CONNECTION_SUGGESTIONS}
          onAddSuggestedAccount={addSuggestedAccount}
          theme={activeTheme}
        />
      );
    }

    if (activeScreen === 'notes') {
      return <NotesScreen sharedCards={SHARED_ACTIVITY} theme={activeTheme} />;
    }

    if (activeScreen === 'share') {
      return (
        <ShareScreen
          displayName={displayName}
          username={username}
          email={email}
          phone={phone}
          isNfcEnabled={isNfcEnabled}
          isAirDropEnabled={isAirDropEnabled}
          profileImageUri={profileImageUri}
          shareDescription={shareDescription}
          sharedContacts={sharedContacts}
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
        onToggleNfc={requestNfcPermission}
        isAirDropEnabled={isAirDropEnabled}
        onToggleAirDrop={requestAirDropPermission}
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
        sharedContacts={sharedContacts}
        onImportContacts={importContactsFromPhone}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: activeTheme.background }]}>
        <StatusBar barStyle="light-content" />
        <View style={[styles.container, { backgroundColor: activeTheme.background }]}>
          <View style={styles.headerWrap}>
            <View style={styles.headerRow}>
              <Ionicons name="share-social" size={24} color={activeTheme.accent} />
              <Text style={styles.headerTitle}>ContactLess</Text>
            </View>
            <Text style={[styles.headerSubtitle, { color: activeTheme.accent }]}>
              Share what you love, with who you love!
            </Text>
          </View>

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
    paddingTop: 2,
  },
  headerWrap: {
    alignItems: 'center',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#f2f7ff',
    fontSize: 28,
    fontWeight: '700',
    marginLeft: 8,
  },
  headerSubtitle: {
    color: '#b0c0d9',
    marginTop: 4,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 18,
  },
});
