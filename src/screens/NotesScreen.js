import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Animated,
  Image,
  Linking,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function NotesScreen({ sharedCards = [], theme }) {
  const accentColor = theme?.accent ?? '#2d76f9';
  const descriptionColor = `${accentColor}CC`;
  const [activeSharedCardId, setActiveSharedCardId] = useState(null);
  const [hiddenNameById, setHiddenNameById] = useState({});
  const [activeAppIndex, setActiveAppIndex] = useState(0);
  const appSwipeY = useRef(new Animated.Value(0)).current;

  const receivedCards = useMemo(
    () => sharedCards.filter((item) => item.direction === 'received'),
    [sharedCards]
  );
  const sentCards = useMemo(
    () => sharedCards.filter((item) => item.direction === 'sent'),
    [sharedCards]
  );
  const activeSharedCard = useMemo(
    () => sharedCards.find((item) => item.id === activeSharedCardId) ?? null,
    [sharedCards, activeSharedCardId]
  );
  const sharedApps = useMemo(() => {
    const rawLinks = activeSharedCard?.links;
    if (!Array.isArray(rawLinks)) {
      return [];
    }

    return rawLinks
      .map((item, index) => {
        if (typeof item === 'string') {
          return {
            id: `${item}-${index}`,
            app: item,
            handle: activeSharedCard?.username ?? 'Not shared',
            profile: 'Not shared',
          };
        }

        return {
          id: item.id ?? `${item.app ?? 'app'}-${index}`,
          app: item.app ?? 'Unknown App',
          handle: item.handle ?? 'Not shared',
          profile: item.profile ?? 'Not shared',
        };
      })
      .filter((item) => item.app);
  }, [activeSharedCard]);
  const activeApp = sharedApps[activeAppIndex] ?? null;
  const nextApp = sharedApps.length > 1
    ? sharedApps[(activeAppIndex + 1) % sharedApps.length]
    : null;
  const isActiveNameHidden = activeSharedCard ? Boolean(hiddenNameById[activeSharedCard.id]) : false;

  useEffect(() => {
    setActiveAppIndex(0);
  }, [activeSharedCardId]);
  useEffect(() => {
    if (activeAppIndex >= sharedApps.length) {
      setActiveAppIndex(0);
    }
  }, [activeAppIndex, sharedApps.length]);

  const cycleAppDeck = (direction) => {
    if (sharedApps.length < 2) {
      return;
    }
    setActiveAppIndex((current) => {
      if (direction === 'next') {
        return (current + 1) % sharedApps.length;
      }
      return (current - 1 + sharedApps.length) % sharedApps.length;
    });
  };

  const appDeckPanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dy) > 5 && sharedApps.length > 1,
        onPanResponderMove: (_, gestureState) => {
          // Shuffle interaction is upward only; downward pulls are dampened.
          const clampedDy = Math.min(gestureState.dy, 0);
          appSwipeY.setValue(clampedDy);
        },
        onPanResponderRelease: (_, gestureState) => {
          const threshold = 28;
          if (gestureState.dy <= -threshold) {
            Animated.timing(appSwipeY, {
              toValue: -150,
              duration: 120,
              useNativeDriver: true,
            }).start(() => {
              cycleAppDeck('next');
              appSwipeY.setValue(0);
            });
            return;
          }

          Animated.spring(appSwipeY, {
            toValue: 0,
            friction: 8,
            tension: 90,
            useNativeDriver: true,
          }).start();
        },
      }),
    [appSwipeY, sharedApps.length]
  );

  const toggleNameVisibility = (id) => {
    setHiddenNameById((current) => ({
      ...current,
      [id]: !Boolean(current[id]),
    }));
  };
  const openProfileLink = async (value) => {
    const raw = (value ?? '').trim();
    if (!raw) {
      return;
    }
    const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      await Linking.openURL(normalized);
    } catch (error) {
      // No-op for now; invalid links are ignored.
    }
  };

  const renderRow = (item) => {
    const isNameHidden = Boolean(hiddenNameById[item.id]);
    const primaryLabel = isNameHidden
      ? item.username?.trim() || 'Unknown user'
      : item.name;
    const initialsSource = (primaryLabel || '').replace('@', '').trim();
    const initials = initialsSource.slice(0, 1).toUpperCase() || '?';

    return (
      <Pressable key={item.id} style={styles.row} onPress={() => setActiveSharedCardId(item.id)}>
      {item.photoUri?.trim() ? (
        <Image source={{ uri: item.photoUri.trim() }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Text style={styles.avatarFallbackText}>{initials}</Text>
        </View>
      )}
      <View style={styles.rowInfo}>
        <Text style={styles.nameText}>{primaryLabel}</Text>
        {!isNameHidden ? (
          <Text style={[styles.metaText, { color: descriptionColor }]}>{item.username}</Text>
        ) : (
          <Text style={[styles.metaText, { color: descriptionColor }]}>Name hidden</Text>
        )}
        <Text style={[styles.metaText, { color: descriptionColor }]}>Method: {item.method}</Text>
      </View>
      <Text style={[styles.timeText, { color: descriptionColor }]}>{item.timeAgo}</Text>
      </Pressable>
    );
  };

  return (
    <View>
      <View style={styles.headerRow}>
        <Ionicons name="albums" size={20} color={descriptionColor} style={styles.headerIcon} />
        <Text style={styles.screenTitle}>Shared</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme?.card ?? '#13233a' }]}>
        <Text style={styles.cardLabel}>Received Cards ({receivedCards.length})</Text>
        {receivedCards.length === 0 ? (
          <Text style={[styles.emptyState, { color: descriptionColor }]}>No received cards yet.</Text>
        ) : (
          receivedCards.map(renderRow)
        )}
      </View>

      <View style={[styles.card, { backgroundColor: theme?.card ?? '#13233a' }]}>
        <Text style={styles.cardLabel}>Sent Cards ({sentCards.length})</Text>
        {sentCards.length === 0 ? (
          <Text style={[styles.emptyState, { color: descriptionColor }]}>No sent cards yet.</Text>
        ) : (
          sentCards.map(renderRow)
        )}
      </View>

      <Modal visible={Boolean(activeSharedCard)} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setActiveSharedCardId(null)}>
          <Pressable
            style={[styles.modalCard, { backgroundColor: theme?.card ?? '#13233a' }]}
            onPress={() => {}}
          >
            <View style={styles.modalStaticContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {activeSharedCard?.direction === 'sent' ? 'Sent Card' : 'Received Card'}
                </Text>
                <Pressable style={styles.modalCloseButton} onPress={() => setActiveSharedCardId(null)}>
                  <Text style={styles.modalCloseButtonText}>X</Text>
                </Pressable>
              </View>

              <View style={styles.modalNameRow}>
                <Text style={styles.modalName}>
                  {isActiveNameHidden
                    ? activeSharedCard?.username || activeSharedCard?.name
                    : activeSharedCard?.name}
                </Text>
                {activeSharedCard ? (
                  <Pressable
                    style={styles.nameToggleButton}
                    onPress={() => toggleNameVisibility(activeSharedCard.id)}
                  >
                    <Ionicons
                      name={isActiveNameHidden ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#d8e4f8"
                    />
                  </Pressable>
                ) : null}
              </View>
              <Text style={[styles.modalRole, { color: descriptionColor }]}>
                {activeSharedCard?.job || 'Not shared'}
              </Text>
              <Text style={[styles.modalLine, { color: descriptionColor }]}>
                Username: {activeSharedCard?.username}
              </Text>
              <Text style={styles.modalLine}>Email: {activeSharedCard?.email}</Text>
              <Text style={styles.modalLine}>Phone: {activeSharedCard?.phone}</Text>
              <Text style={styles.modalSectionLabel}>Apps Shared</Text>
              {sharedApps.length > 0 ? (
                <>
                  <View style={styles.appDeckWrap}>
                    {nextApp ? (
                      <Animated.View
                        style={[
                          styles.appDeckBackCard,
                          {
                            transform: [
                              {
                                translateY: appSwipeY.interpolate({
                                  inputRange: [-120, 0],
                                  outputRange: [0, 18],
                                  extrapolate: 'clamp',
                                }),
                              },
                              {
                                scale: appSwipeY.interpolate({
                                  inputRange: [-120, 0],
                                  outputRange: [1, 0.96],
                                  extrapolate: 'clamp',
                                }),
                              },
                            ],
                            opacity: appSwipeY.interpolate({
                              inputRange: [-120, 0],
                              outputRange: [1, 0.82],
                              extrapolate: 'clamp',
                            }),
                          },
                        ]}
                      >
                        <Text style={styles.appDeckBackText}>{nextApp.app}</Text>
                      </Animated.View>
                    ) : null}
                    <Animated.View
                      {...appDeckPanResponder.panHandlers}
                      style={[
                        styles.appDeckFrontCard,
                        {
                          transform: [
                            { translateY: appSwipeY },
                            {
                              rotate: appSwipeY.interpolate({
                                inputRange: [-150, 0],
                                outputRange: ['-3deg', '0deg'],
                                extrapolate: 'clamp',
                              }),
                            },
                          ],
                          opacity: appSwipeY.interpolate({
                            inputRange: [-150, 0],
                            outputRange: [0.78, 1],
                            extrapolate: 'clamp',
                          }),
                        },
                      ]}
                    >
                      <Pressable onPress={() => cycleAppDeck('next')}>
                        <Text style={styles.appDetailsTitle}>{activeApp?.app}</Text>
                        <Text style={[styles.appDetailsLine, { color: descriptionColor }]}>
                          Handle: {activeApp?.handle}
                        </Text>
                        <Pressable onPress={() => openProfileLink(activeApp?.profile)}>
                          <Text style={styles.appLinkLine}>
                            Profile: {activeApp?.profile}
                          </Text>
                        </Pressable>
                      </Pressable>
                    </Animated.View>
                  </View>
                </>
              ) : (
                <Text style={[styles.modalLine, { color: descriptionColor }]}>No app data shared.</Text>
              )}
              <Text style={[styles.modalBio, { color: descriptionColor }]}>
                {activeSharedCard?.bio}
              </Text>
              <View style={styles.modalFooterMeta}>
                <Text style={[styles.modalFooterLine, { color: descriptionColor }]}>
                  Method: {activeSharedCard?.method}
                </Text>
                <Text style={[styles.modalFooterLine, { color: descriptionColor }]}>
                  Shared: {activeSharedCard?.timeAgo}
                </Text>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#223957',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: '#102039',
  },
  rowInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
    fontSize: 14,
    fontWeight: '700',
  },
  nameText: {
    color: '#d8e4f8',
    fontSize: 15,
    fontWeight: '600',
  },
  metaText: {
    color: '#9eb1ce',
    fontSize: 12,
    marginTop: 2,
  },
  timeText: {
    color: '#9eb1ce',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    color: '#9eb1ce',
    fontSize: 13,
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
    maxHeight: '84%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#355072',
    padding: 14,
  },
  modalStaticContent: {
    paddingBottom: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    color: '#f2f7ff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#355072',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f1d30',
  },
  modalCloseButtonText: {
    color: '#d8e4f8',
    fontSize: 12,
    fontWeight: '700',
  },
  modalName: {
    color: '#f2f7ff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  modalNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  nameToggleButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#5878a6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1d3456',
    marginLeft: 8,
    opacity: 0.95,
  },
  modalRole: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalSectionLabel: {
    color: '#f2f7ff',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 7,
  },
  appDeckWrap: {
    marginBottom: 10,
    height: 122,
    position: 'relative',
  },
  appDeckBackCard: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: 18,
    borderWidth: 1,
    borderColor: '#355072',
    borderRadius: 12,
    backgroundColor: '#0d1a2d',
    paddingHorizontal: 10,
    paddingVertical: 12,
    opacity: 0.85,
  },
  appDeckBackText: {
    color: '#9eb1ce',
    fontSize: 12,
    fontWeight: '700',
  },
  appDeckFrontCard: {
    backgroundColor: '#1d3456',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#5878a6',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  appDetailsTitle: {
    color: '#f2f7ff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  appDetailsLine: {
    color: '#d8e4f8',
    fontSize: 12,
    marginBottom: 4,
  },
  appLinkLine: {
    color: '#8ec0ff',
    fontSize: 12,
    marginBottom: 4,
    textDecorationLine: 'underline',
  },
  modalLine: {
    color: '#d8e4f8',
    fontSize: 13,
    marginBottom: 6,
  },
  modalBio: {
    color: '#9eb1ce',
    fontSize: 13,
    marginTop: 4,
  },
  modalFooterMeta: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFooterLine: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 0,
    fontWeight: '500',
    marginHorizontal: 8,
  },
});
