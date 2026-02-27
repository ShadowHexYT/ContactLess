import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const ICON_BY_ACCOUNT = {
  google: 'logo-google',
  icloud: 'logo-apple',
  outlook: 'logo-microsoft',
  spotify: 'logo-spotify',
  snapchat: 'logo-snapchat',
  'apple-music': 'musical-notes',
  pinterest: 'logo-pinterest',
  instagram: 'logo-instagram',
  tiktok: 'logo-tiktok',
  linkedin: 'logo-linkedin',
  x: 'at',
  youtube: 'logo-youtube',
  discord: 'logo-discord',
  whatsapp: 'logo-whatsapp',
  telegram: 'paper-plane',
  facebook: 'logo-facebook',
  github: 'logo-github',
};

export default function ConnectionsScreen({
  accounts,
  connectedCount,
  onLinkAccount,
  onDeleteAccount,
  suggestions = [],
  onAddSuggestedAccount,
  theme,
}) {
  const [deleteArmedAccountId, setDeleteArmedAccountId] = useState(null);
  const [linkingAccountId, setLinkingAccountId] = useState(null);
  const [credentialUser, setCredentialUser] = useState('');
  const [credentialPassword, setCredentialPassword] = useState('');
  const descriptionColor = `${(theme?.accent ?? '#9eb1ce')}CC`;
  const accentColor = theme?.accent ?? '#2d76f9';
  const accentBorder = `${accentColor}99`;
  const remainingSuggestions = suggestions.filter(
    (suggestion) => !accounts.some((account) => account.id === suggestion.id)
  );
  const hasSuggestions = remainingSuggestions.length > 0;
  const nextSuggestion = remainingSuggestions[0];
  const isDeleteArmed = deleteArmedAccountId !== null;
  const linkingAccount = accounts.find((item) => item.id === linkingAccountId) ?? null;

  const requestDeleteAccount = (account) => {
    Alert.alert(
      'Delete Connection',
      `Delete ${account.label}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeleteAccount?.(account.id),
        },
      ]
    );
    setDeleteArmedAccountId(null);
  };
  const openLinkModal = (account) => {
    setLinkingAccountId(account.id);
    setCredentialUser('');
    setCredentialPassword('');
  };
  const closeLinkModal = () => {
    setLinkingAccountId(null);
    setCredentialUser('');
    setCredentialPassword('');
  };
  const confirmLinkAccount = () => {
    if (!linkingAccount) {
      return;
    }

    if (!credentialUser.trim() || !credentialPassword.trim()) {
      Alert.alert('Missing Credentials', 'Enter both username/email and password.');
      return;
    }

    onLinkAccount?.(linkingAccount.id);
    closeLinkModal();
  };

  return (
    <>
    <Pressable onPress={() => setDeleteArmedAccountId(null)}>
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
                onPress={(event) => {
                  event.stopPropagation();
                  if (isDeleteArmed) {
                    setDeleteArmedAccountId(null);
                    return;
                  }
                  openLinkModal(item);
                }}
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
                delayLongPress={260}
                onLongPress={() => setDeleteArmedAccountId(item.id)}
                onPress={(event) => {
                  event.stopPropagation();
                  if (isDeleteArmed) {
                    setDeleteArmedAccountId(null);
                    return;
                  }
                }}
                style={({ pressed }) => [styles.bubbleBody, pressed && styles.bubbleBodyPressed]}
              >
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowHint}>{item.connected ? 'Connected' : 'Not connected'}</Text>
                {deleteArmedAccountId === item.id ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${item.label}`}
                    onPress={(event) => {
                      event.stopPropagation();
                      requestDeleteAccount(item);
                    }}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>X</Text>
                  </Pressable>
                ) : null}
              </Pressable>
            </View>
          );
        })}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add new connection"
          disabled={!hasSuggestions}
          onPress={(event) => {
            event.stopPropagation();
            if (isDeleteArmed) {
              setDeleteArmedAccountId(null);
              return;
            }
            onAddSuggestedAccount?.(nextSuggestion);
          }}
          style={({ pressed }) => [
            styles.addButton,
            !hasSuggestions && styles.addButtonDisabled,
            pressed && hasSuggestions && styles.addButtonPressed,
          ]}
        >
          <Ionicons name="add" size={18} color="#f2f7ff" />
          <Text style={styles.addButtonText}>Add Connection</Text>
        </Pressable>

        <View style={styles.suggestionsWrap}>
          {remainingSuggestions.map((suggestion) => (
            <Pressable
              key={suggestion.id}
              accessibilityRole="button"
              accessibilityLabel={`Add ${suggestion.label}`}
              onPress={(event) => {
                event.stopPropagation();
                if (isDeleteArmed) {
                  setDeleteArmedAccountId(null);
                  return;
                }
                onAddSuggestedAccount?.(suggestion);
              }}
              style={({ pressed }) => [styles.suggestionChip, pressed && styles.suggestionChipPressed]}
            >
              <Text style={styles.suggestionText}>{suggestion.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Pressable>
    <Modal visible={Boolean(linkingAccount)} transparent animationType="fade">
      <Pressable style={styles.modalBackdrop} onPress={closeLinkModal}>
        <Pressable
          style={[styles.modalCard, { backgroundColor: theme?.card ?? '#13233a', borderColor: accentBorder }]}
          onPress={() => {}}
        >
          <Text style={styles.modalTitle}>Link {linkingAccount?.label ?? 'Account'}</Text>
          <Text style={[styles.modalSubtitle, { color: descriptionColor }]}>
            Enter credentials to link this connection.
          </Text>

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Username or email"
            placeholderTextColor="#7f93b3"
            style={[styles.input, { borderColor: accentBorder }]}
            value={credentialUser}
            onChangeText={setCredentialUser}
          />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#7f93b3"
            style={[styles.input, { borderColor: accentBorder }]}
            value={credentialPassword}
            onChangeText={setCredentialPassword}
          />

          <View style={styles.modalActions}>
            <Pressable style={[styles.modalButton, { borderColor: accentBorder }]} onPress={closeLinkModal}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.modalButton, { backgroundColor: accentColor, borderColor: accentColor }]} onPress={confirmLinkAccount}>
              <Text style={styles.modalConfirmText}>Link</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
    </>
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
    position: 'relative',
    flex: 1,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingRight: 44,
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
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3a4f6f',
    backgroundColor: '#0a1526',
  },
  removeButtonText: {
    color: '#d8e4f8',
    fontSize: 12,
    fontWeight: '700',
  },
  addButton: {
    marginTop: 6,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#2d76f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#4c607f',
    opacity: 0.7,
  },
  addButtonPressed: {
    opacity: 0.9,
  },
  addButtonText: {
    color: '#f2f7ff',
    fontWeight: '700',
    marginLeft: 6,
  },
  suggestionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  suggestionChip: {
    backgroundColor: '#0f1d30',
    borderWidth: 1,
    borderColor: '#223957',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionChipPressed: {
    opacity: 0.85,
  },
  suggestionText: {
    color: '#d8e4f8',
    fontSize: 12,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(8, 12, 20, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  modalTitle: {
    color: '#f2f7ff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalSubtitle: {
    marginTop: 4,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: '500',
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderRadius: 10,
    color: '#f2f7ff',
    paddingHorizontal: 10,
    marginBottom: 8,
    backgroundColor: '#0f1d30',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  modalButton: {
    minWidth: 82,
    height: 36,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  modalCancelText: {
    color: '#d8e4f8',
    fontWeight: '700',
    fontSize: 13,
  },
  modalConfirmText: {
    color: '#f2f7ff',
    fontWeight: '700',
    fontSize: 13,
  },
});
