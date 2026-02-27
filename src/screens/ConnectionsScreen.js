import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function ConnectionsScreen({ accounts, connectedCount, onToggleAccount, theme }) {
  const descriptionColor = `${(theme?.accent ?? '#9eb1ce')}CC`;

  return (
    <View>
      <Text style={styles.screenTitle}>Account Connections</Text>
      <Text style={[styles.screenSubtitle, { color: descriptionColor }]}>
        Link contact providers now. Actual auth can be implemented next.
      </Text>

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
