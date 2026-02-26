import React from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';

export default function SettingsScreen({
  displayName,
  onChangeDisplayName,
  email,
  onChangeEmail,
  phone,
  onChangePhone,
  isNfcEnabled,
  onToggleNfc,
}) {
  return (
    <View>
      <Text style={styles.screenTitle}>Settings</Text>
      <Text style={styles.screenSubtitle}>
        Configure profile fields and app-level sharing behavior.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Contact Information</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={onChangeDisplayName}
          placeholder="Full name"
          placeholderTextColor="#6d7888"
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={onChangeEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Email"
          placeholderTextColor="#6d7888"
        />
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={onChangePhone}
          keyboardType="phone-pad"
          placeholder="Phone"
          placeholderTextColor="#6d7888"
        />
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.rowLabel}>Enable NFC Sharing</Text>
          <Switch value={isNfcEnabled} onValueChange={onToggleNfc} />
        </View>
        <Text style={styles.cardMuted}>
          Placeholder toggle only. NFC permissions/session setup will be added in the next phase.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    color: '#f2f7ff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  screenSubtitle: {
    color: '#b0c0d9',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#13233a',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  cardLabel: {
    color: '#f2f7ff',
    fontWeight: '700',
    marginBottom: 10,
  },
  cardMuted: {
    color: '#9eb1ce',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0d1726',
    color: '#f2f7ff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#223b5d',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowLabel: {
    color: '#d8e4f8',
    fontSize: 15,
    flex: 1,
    marginRight: 8,
  },
});
