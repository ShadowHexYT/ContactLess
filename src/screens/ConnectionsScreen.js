import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function ConnectionsScreen({ accounts, connectedCount, onToggleAccount, theme }) {
  const descriptionColor = `${(theme?.accent ?? '#9eb1ce')}CC`;

  return (
    <View>
      <View style={styles.headerRow}>
        <Ionicons name="people" size={20} color={descriptionColor} style={styles.headerIcon} />
        <Text style={styles.screenTitle}>Connections</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme?.card ?? '#13233a' }]}>
        <Text style={styles.cardLabel}>Connected: {connectedCount}/{accounts.length}</Text>
        {accounts.map((item) => (
          <View key={item.id} style={styles.rowBetween}>
            <Text style={styles.rowLabel}>{item.label}</Text>
            <Switch value={item.connected} onValueChange={() => onToggleAccount(item.id)} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerIcon: {
    marginRight: 8,
  },
  screenTitle: {
    color: '#f2f7ff',
    fontSize: 22,
    fontWeight: '700',
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
