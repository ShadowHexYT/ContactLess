import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function ShareScreen({
  displayName,
  username,
  email,
  phone,
  isNfcEnabled,
  isAirDropEnabled,
  profileImageUri,
  shareDescription,
  sharedContacts,
  theme,
}) {
  const initials = displayName?.trim()?.slice(0, 1)?.toUpperCase() || '?';
  const cleanUsername = username?.trim();
  const descriptionColor = `${(theme?.accent ?? '#9eb1ce')}CC`;

  return (
    <View>
      <View style={styles.headerRow}>
        <Ionicons name="share-social" size={20} color={descriptionColor} style={styles.headerIcon} />
        <Text style={styles.screenTitle}>Share</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme?.card ?? '#13233a' }]}>
        <Text style={styles.cardLabel}>Live Card Preview</Text>
        <View style={styles.previewHeader}>
          {profileImageUri?.trim() ? (
            <Image source={{ uri: profileImageUri.trim() }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarFallbackText}>{initials}</Text>
            </View>
          )}
          <View>
            <Text style={styles.previewLine}>{displayName}</Text>
            {cleanUsername ? <Text style={[styles.handleLine, { color: descriptionColor }]}>{cleanUsername}</Text> : null}
          </View>
        </View>
        {shareDescription?.trim() ? (
          <Text style={styles.descriptionLine}>{shareDescription.trim()}</Text>
        ) : null}
        <Text style={styles.previewLine}>{email}</Text>
        <Text style={styles.previewLine}>{phone}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme?.card ?? '#13233a' }]}>
        <Text style={styles.cardLabel}>Share Methods</Text>
        <Text style={[styles.cardMuted, { color: descriptionColor }]}>
          NFC: {isNfcEnabled ? 'Enabled' : 'Disabled'}
        </Text>
        <Text style={[styles.cardMuted, { color: descriptionColor }]}>
          AirDrop: {isAirDropEnabled ? 'Allowed' : 'Not Allowed'}
        </Text>
        <Text style={[styles.cardMuted, { color: descriptionColor }]}>QR: Ready</Text>
        <Text style={[styles.cardMuted, { color: descriptionColor }]}>Link: Ready</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme?.card ?? '#13233a' }]}>
        <Text style={styles.cardLabel}>Imported Contacts ({sharedContacts.length})</Text>
        {sharedContacts.length === 0 ? (
          <Text style={[styles.cardMuted, { color: descriptionColor }]}>
            Import contacts in Settings to share their numbers via NFC.
          </Text>
        ) : (
          sharedContacts.slice(0, 6).map((contact) => (
            <View key={contact.id} style={styles.contactRow}>
              <Text style={styles.previewLine}>
                {contact.name} - {contact.phone}
              </Text>
              <Text style={[styles.contactBadge, { color: descriptionColor, borderColor: `${descriptionColor}66` }]}>
                NFC Ready
              </Text>
            </View>
          ))
        )}
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
  cardMuted: {
    color: '#9eb1ce',
    marginBottom: 6,
  },
  previewLine: {
    color: '#d8e4f8',
    marginBottom: 6,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
    backgroundColor: '#0d1726',
  },
  avatarFallback: {
    borderWidth: 1,
    borderColor: '#355072',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: {
    color: '#f2f7ff',
    fontSize: 18,
    fontWeight: '700',
  },
  handleLine: {
    color: '#9eb1ce',
    marginBottom: 4,
  },
  descriptionLine: {
    color: '#d8e4f8',
    marginBottom: 8,
    lineHeight: 19,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  contactBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 11,
    fontWeight: '700',
  },
});
