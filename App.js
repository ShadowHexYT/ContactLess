import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import BottomNav from './src/components/BottomNav';
import ConnectionsScreen from './src/screens/ConnectionsScreen';
import HomeScreen from './src/screens/HomeScreen';
import NotesScreen from './src/screens/NotesScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const DEFAULT_ACCOUNTS = [
  { id: 'google', label: 'Google Contacts', connected: false },
  { id: 'icloud', label: 'Apple iCloud', connected: false },
  { id: 'outlook', label: 'Microsoft Outlook', connected: false },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [displayName, setDisplayName] = useState('Your Name');
  const [email, setEmail] = useState('you@example.com');
  const [phone, setPhone] = useState('+1 000 000 0000');
  const [notes, setNotes] = useState('Add personal notes or quick reminders here.');
  const [isNfcEnabled, setIsNfcEnabled] = useState(false);
  const [accounts, setAccounts] = useState(DEFAULT_ACCOUNTS);

  const connectedCount = useMemo(
    () => accounts.filter((item) => item.connected).length,
    [accounts]
  );

  const toggleAccount = (id) => {
    setAccounts((current) =>
      current.map((item) =>
        item.id === id ? { ...item, connected: !item.connected } : item
      )
    );
  };

  const renderScreen = () => {
    if (activeScreen === 'home') {
      return <HomeScreen displayName={displayName} email={email} phone={phone} />;
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.headerTitle}>ContactLess</Text>
        <Text style={styles.headerSubtitle}>NFC Contact Share Baseline</Text>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {renderScreen()}
        </ScrollView>

        <BottomNav activeScreen={activeScreen} onChange={setActiveScreen} />
      </View>
    </SafeAreaView>
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
