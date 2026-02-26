import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen({ displayName, email, phone }) {
  return (
    <View>
      <Text style={styles.screenTitle}>Home</Text>
      <Text style={styles.screenSubtitle}>
        Baseline profile and sharing preview. NFC flow intentionally not implemented yet.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Profile Preview</Text>
        <Text style={styles.previewLine}>{displayName}</Text>
        <Text style={styles.previewLine}>{email}</Text>
        <Text style={styles.previewLine}>{phone}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Quick Actions</Text>
        <Text style={styles.cardMuted}>- Edit contact fields in Settings</Text>
        <Text style={styles.cardMuted}>- Manage providers in Connections</Text>
        <Text style={styles.cardMuted}>- Keep share notes in Notes</Text>
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
