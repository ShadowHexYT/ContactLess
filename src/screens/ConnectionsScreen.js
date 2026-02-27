import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const ICON_BY_ACCOUNT = {
  google: 'logo-google',
  icloud: 'logo-apple',
  outlook: 'logo-microsoft',
  spotify: 'logo-spotify',
};

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

        {accounts.map((item) => {
          const iconName = ICON_BY_ACCOUNT[item.id] ?? 'link';

          return (
            <View key={item.id} style={styles.connectionBubble}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${item.label} icon`}
                onPress={() => onToggleAccount(item.id)}
                style={({ pressed }) => [
                  styles.iconButton,
                  item.connected && styles.iconButtonConnected,
                  pressed && styles.iconButtonPressed,
                ]}
              >
                <Ionicons
                  color={item.connected ? '#f2f7ff' : '#9eb1ce'}
                  name={iconName}
                  size={22}
                />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${item.label} bubble`}
                onPress={() => {}}
                style={({ pressed }) => [styles.bubbleBody, pressed && styles.bubbleBodyPressed]}
              >
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowHint}>{item.connected ? 'Connected' : 'Not connected'}</Text>
              </Pressable>
            </View>
          );
        })}
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
  connectionBubble: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 10,
  },
  iconButton: {
    width: 52,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f1d30',
    borderWidth: 1,
    borderColor: '#223957',
    borderRightWidth: 0,
  },
  iconButtonConnected: {
    backgroundColor: '#2d76f9',
    borderColor: '#2d76f9',
  },
  iconButtonPressed: {
    opacity: 0.88,
  },
  bubbleBody: {
    flex: 1,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#102039',
    borderWidth: 1,
    borderColor: '#223957',
    justifyContent: 'center',
  },
  bubbleBodyPressed: {
    opacity: 0.9,
  },
  rowLabel: {
    color: '#d8e4f8',
    fontSize: 15,
    fontWeight: '600',
  },
  rowHint: {
    color: '#9eb1ce',
    fontSize: 12,
    marginTop: 2,
  },
});
