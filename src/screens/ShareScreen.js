import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ShareScreen({ displayName, email, phone, isNfcEnabled }) {
  return (
    <View>
      <Text style={styles.screenTitle}>Share</Text>
      <Text style={styles.screenSubtitle}>
        Choose how you want to share your contact card right now.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Live Card Preview</Text>
        <Text style={styles.previewLine}>{displayName}</Text>
        <Text style={styles.previewLine}>{email}</Text>
        <Text style={styles.previewLine}>{phone}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Share Methods</Text>
        <Text style={styles.cardMuted}>NFC: {isNfcEnabled ? 'Enabled' : 'Disabled'}</Text>
        <Text style={styles.cardMuted}>QR: Ready</Text>
        <Text style={styles.cardMuted}>Link: Ready</Text>
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
  previewLine: {
    color: '#d8e4f8',
    marginBottom: 6,
  },
});
