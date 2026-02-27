import React, { useMemo, useState } from 'react';
import { Alert, Image, Modal, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

export default function SettingsScreen({
  displayName,
  onChangeDisplayName,
  username,
  onChangeUsername,
  email,
  onChangeEmail,
  phone,
  onChangePhone,
  isNfcEnabled,
  onToggleNfc,
  profileImageUri,
  onChangeProfileImageUri,
  shareDescription,
  onChangeShareDescription,
  themeId,
  themePresets,
  onChangeThemeId,
  theme,
}) {
  const initials = displayName?.trim()?.slice(0, 1)?.toUpperCase() || '?';
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);
  const [photoDraft, setPhotoDraft] = useState(profileImageUri);
  const activeThemeLabel = useMemo(
    () => themePresets.find((preset) => preset.id === themeId)?.label ?? 'Select theme',
    [themeId, themePresets]
  );
  const pickFromLibrary = async () => {
    try {
      const ImagePicker = await import('expo-image-picker');
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Allow photo library access to choose a profile image.');
        return;
      }

      const mediaTypes =
        ImagePicker.MediaTypeOptions?.Images ?? ImagePicker.MediaType?.Images ?? 'images';
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const selectedUri = result.assets[0].uri;
        setPhotoDraft(selectedUri);
        onChangeProfileImageUri(selectedUri);
        setIsPhotoMenuOpen(false);
      }
    } catch (error) {
      Alert.alert(
        'Upload unavailable',
        'Image picker is not available yet. Run npm install and restart the app.'
      );
    }
  };

  return (
    <View>
      <Text style={styles.screenTitle}>Settings</Text>
      <Text style={styles.screenSubtitle}>
        Configure profile fields, theme, and share card appearance.
      </Text>

      <View style={[styles.card, { backgroundColor: theme?.card ?? '#13233a' }]}>
        <Text style={styles.cardLabel}>Contact Information</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={onChangeDisplayName}
          placeholder="Display name"
          placeholderTextColor="#6d7888"
        />
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={onChangeUsername}
          placeholder="@username"
          placeholderTextColor="#6d7888"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={onChangeEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Email"
          placeholderTextColor="#6d7888"
        />
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={onChangePhone}
          keyboardType="phone-pad"
          placeholder="Phone"
          placeholderTextColor="#6d7888"
        />
      </View>

      <View style={[styles.card, { backgroundColor: theme?.card ?? '#13233a' }]}>
        <Text style={styles.cardLabel}>Share Card Message</Text>
        <View style={styles.avatarRow}>
          <Pressable
            style={styles.avatarButton}
            onPress={() => {
              setPhotoDraft(profileImageUri);
              setIsPhotoMenuOpen(true);
            }}
          >
            {profileImageUri?.trim() ? (
              <Image source={{ uri: profileImageUri.trim() }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarFallbackText}>{initials}</Text>
              </View>
            )}
            <View style={styles.plusBadge}>
              <Text style={styles.plusBadgeText}>+</Text>
            </View>
          </Pressable>
          <Text style={styles.cardMuted}>
            This message appears with your name and image when sharing.
          </Text>
        </View>
        <TextInput
          style={[styles.input, styles.messageInput]}
          value={shareDescription}
          onChangeText={onChangeShareDescription}
          placeholder="Write a short message for your share card..."
          placeholderTextColor="#6d7888"
          multiline
        />
      </View>

      <View style={[styles.card, { backgroundColor: theme?.card ?? '#13233a' }]}>
        <Text style={styles.cardLabel}>Theme Colors</Text>
        <Pressable style={styles.dropdownButton} onPress={() => setIsThemeMenuOpen(true)}>
          <Text style={styles.dropdownButtonText}>{activeThemeLabel}</Text>
          <Text style={styles.dropdownChevron}>▼</Text>
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: theme?.card ?? '#13233a' }]}>
        <View style={styles.rowBetween}>
          <Text style={styles.rowLabel}>Enable NFC Sharing</Text>
          <Switch value={isNfcEnabled} onValueChange={onToggleNfc} />
        </View>
        <Text style={styles.cardMuted}>
          Placeholder toggle only. NFC permissions/session setup will be added in the next phase.
        </Text>
      </View>

      <Modal visible={isThemeMenuOpen} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setIsThemeMenuOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Select Theme</Text>
            {themePresets.map((preset) => (
              <Pressable
                key={preset.id}
                onPress={() => {
                  onChangeThemeId(preset.id);
                  setIsThemeMenuOpen(false);
                }}
                style={styles.themeOption}
              >
                <View style={[styles.themeDot, { backgroundColor: preset.accent }]} />
                <Text style={styles.themeOptionText}>{preset.label}</Text>
                {preset.id === themeId ? <Text style={styles.themeSelected}>Selected</Text> : null}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={isPhotoMenuOpen} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setIsPhotoMenuOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Change Photo</Text>
            <TextInput
              style={styles.input}
              value={photoDraft}
              onChangeText={setPhotoDraft}
              placeholder="Paste image URL (https://...)"
              placeholderTextColor="#6d7888"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable style={styles.libraryButton} onPress={pickFromLibrary}>
              <Text style={styles.libraryButtonText}>Upload From Library</Text>
            </Pressable>
            <View style={styles.photoActions}>
              <Pressable
                style={[styles.actionButton, styles.clearButton]}
                onPress={() => {
                  setPhotoDraft('');
                  onChangeProfileImageUri('');
                  setIsPhotoMenuOpen(false);
                }}
              >
                <Text style={styles.actionButtonText}>Clear</Text>
              </Pressable>
              <Pressable
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setIsPhotoMenuOpen(false)}
              >
                <Text style={styles.actionButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.actionButton, styles.saveButton]}
                onPress={() => {
                  onChangeProfileImageUri(photoDraft.trim());
                  setIsPhotoMenuOpen(false);
                }}
              >
                <Text style={styles.actionButtonText}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarButton: {
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0d1726',
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#355072',
  },
  avatarFallbackText: {
    color: '#f2f7ff',
    fontWeight: '700',
    fontSize: 18,
  },
  plusBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2d76f9',
    borderWidth: 1,
    borderColor: '#f2f7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBadgeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 15,
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
  messageInput: {
    minHeight: 84,
    textAlignVertical: 'top',
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
  dropdownButton: {
    backgroundColor: '#0d1726',
    borderWidth: 1,
    borderColor: '#223b5d',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    color: '#f2f7ff',
    fontSize: 14,
    fontWeight: '600',
  },
  dropdownChevron: {
    color: '#9eb1ce',
    fontSize: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(8, 15, 27, 0.72)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#13233a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#355072',
    padding: 14,
  },
  modalTitle: {
    color: '#f2f7ff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#1f3552',
  },
  themeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  themeOptionText: {
    color: '#d8e4f8',
    flex: 1,
  },
  themeSelected: {
    color: '#9ed7ff',
    fontSize: 12,
    fontWeight: '700',
  },
  photoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#7a2f36',
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#253a57',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#2d76f9',
  },
  actionButtonText: {
    color: '#f2f7ff',
    fontWeight: '700',
    fontSize: 13,
  },
  libraryButton: {
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#355072',
    paddingVertical: 10,
    alignItems: 'center',
  },
  libraryButtonText: {
    color: '#d8e4f8',
    fontWeight: '700',
    fontSize: 13,
  },
});
