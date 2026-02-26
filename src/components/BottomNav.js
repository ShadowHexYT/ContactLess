import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BottomNav({ activeScreen, onChange }) {
  const navButton = (key, label) => (
    <TouchableOpacity
      key={key}
      style={[styles.navButton, activeScreen === key && styles.navButtonActive]}
      onPress={() => onChange(key)}
    >
      <Text style={[styles.navButtonText, activeScreen === key && styles.navButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.navBar}>
      {navButton('home', 'Home')}
      {navButton('connections', 'Connections')}
      {navButton('notes', 'Notes')}
      {navButton('settings', 'Settings')}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#12213a',
    padding: 8,
    borderRadius: 12,
    marginBottom: 14,
    marginTop: 4,
  },
  navButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  navButtonActive: {
    backgroundColor: '#2d76f9',
  },
  navButtonText: {
    color: '#c4d3eb',
    fontWeight: '600',
    fontSize: 13,
  },
  navButtonTextActive: {
    color: '#ffffff',
  },
});
