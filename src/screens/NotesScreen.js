import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function NotesScreen({ notes, onChangeNotes }) {
  return (
    <View>
      <Text style={styles.screenTitle}>Notes</Text>
      <Text style={styles.screenSubtitle}>
        Draft notes to include with shared contact details.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Personal Notes</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={notes}
          onChangeText={onChangeNotes}
          placeholder="Type notes for your contact card..."
          placeholderTextColor="#6d7888"
          multiline
        />
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
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
});
