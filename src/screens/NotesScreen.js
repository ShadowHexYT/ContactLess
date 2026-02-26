import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function NotesScreen({ notes, onChangeNotes }) {
  const [query, setQuery] = useState('');

  return (
    <View>
      <Text style={styles.screenTitle}>Notes</Text>
      <Text style={styles.screenSubtitle}>
        Draft notes to include with shared contact details.
      </Text>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search all notes"
          placeholderTextColor="#7f93b3"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

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
  searchWrap: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#13233a',
    color: '#f2f7ff',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#223b5d',
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
