import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const NAV_INSET = 8;

export default function BottomNav({ activeScreen, onChange, theme }) {
  const inactiveColor = `${(theme?.accent ?? '#c4d3eb')}CC`;
  const tabs = [
    { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
    {
      key: 'connections',
      label: 'Connections',
      icon: 'people-outline',
      activeIcon: 'people',
    },
    { key: 'share', label: 'Share', icon: 'share-social-outline', activeIcon: 'share-social' },
    { key: 'notes', label: 'Notes', icon: 'document-text-outline', activeIcon: 'document-text' },
    { key: 'settings', label: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
  ];
  const activeIndex = Math.max(0, tabs.findIndex((item) => item.key === activeScreen));
  const indicatorLeft = useRef(new Animated.Value(activeIndex)).current;
  const [barWidth, setBarWidth] = useState(0);
  const [barHeight, setBarHeight] = useState(0);
  const tabWidth = useMemo(
    () => (barWidth > 0 ? (barWidth - NAV_INSET * 2) / tabs.length : 0),
    [barWidth, tabs.length]
  );
  const tabHeight = useMemo(() => (barHeight > 0 ? barHeight - NAV_INSET * 2 : 0), [barHeight]);
  const activeCircleSize = useMemo(
    () => (tabWidth > 0 && tabHeight > 0 ? Math.min(tabWidth, tabHeight) * 1 : 0),
    [tabHeight, tabWidth]
  );

  useEffect(() => {
    Animated.timing(indicatorLeft, {
      toValue: activeIndex,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [activeIndex, indicatorLeft]);

  const navButton = ({ key, label, icon, activeIcon }) => (
    <TouchableOpacity
      key={key}
      style={styles.navButton}
      onPress={() => onChange(key)}
    >
      <Ionicons
        name={activeScreen === key ? activeIcon : icon}
        size={20}
        color={activeScreen === key ? '#ffffff' : inactiveColor}
        style={styles.navButtonIcon}
      />
      <Text
        style={[
          styles.navButtonText,
          { color: activeScreen === key ? '#ffffff' : inactiveColor },
          activeScreen === key && styles.navButtonTextActive,
          key === 'share' && styles.shareText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const indicatorStyle = {
    width: activeCircleSize,
    height: activeCircleSize,
    borderRadius: activeCircleSize / 2,
    top: (barHeight - activeCircleSize) / 2,
    left: NAV_INSET + (tabWidth - activeCircleSize) / 2,
    backgroundColor: theme?.accent ?? '#2d76f9',
    transform: [{ translateX: Animated.multiply(indicatorLeft, tabWidth) }],
  };

  return (
    <View
      style={[styles.navBar, { backgroundColor: theme?.card ?? '#12213a' }]}
      onLayout={(event) => {
        setBarWidth(event.nativeEvent.layout.width);
        setBarHeight(event.nativeEvent.layout.height);
      }}
    >
      <Animated.View style={[styles.activePill, indicatorStyle]} />
      {tabs.map((tab) => navButton(tab))}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#12213a',
    padding: NAV_INSET,
    borderRadius: 12,
    marginBottom: 14,
    marginTop: 4,
    position: 'relative',
  },
  navButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  navButtonIcon: {
    marginBottom: 1,
  },
  activePill: {
    position: 'absolute',
  },
  navButtonText: {
    color: '#c4d3eb',
    fontWeight: '600',
    fontSize: 11,
    textAlign: 'center',
  },
  navButtonTextActive: {
    color: '#ffffff',
  },
  shareText: {
    fontWeight: '700',
  },
});
