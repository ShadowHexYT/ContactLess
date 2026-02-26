import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BottomNav({ activeScreen, onChange }) {
  const tabs = [
    { key: 'home', label: 'Home' },
    { key: 'connections', label: 'Connections' },
    { key: 'share', label: 'Share' },
    { key: 'notes', label: 'Notes' },
    { key: 'settings', label: 'Settings' },
  ];
  const activeIndex = Math.max(0, tabs.findIndex((item) => item.key === activeScreen));
  const indicatorLeft = useRef(new Animated.Value(activeIndex)).current;
  const [barWidth, setBarWidth] = useState(0);
  const tabWidth = useMemo(
    () => (barWidth > 0 ? (barWidth - 16) / tabs.length : 0),
    [barWidth, tabs.length]
  );

  useEffect(() => {
    Animated.timing(indicatorLeft, {
      toValue: activeIndex,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [activeIndex, indicatorLeft]);

  const navButton = (key, label) => (
    <TouchableOpacity
      key={key}
      style={styles.navButton}
      onPress={() => onChange(key)}
    >
      <Text
        style={[
          styles.navButtonText,
          activeScreen === key && styles.navButtonTextActive,
          key === 'share' && styles.shareText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const indicatorStyle = {
    width: tabWidth,
    transform: [{ translateX: Animated.multiply(indicatorLeft, tabWidth) }],
  };

  return (
    <View style={styles.navBar} onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}>
      <Animated.View style={[styles.activePill, indicatorStyle]} />
      {tabs.map((tab) => navButton(tab.key, tab.label))}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#12213a',
    padding: 8,
    borderRadius: 12,
    marginBottom: 14,
    marginTop: 4,
    position: 'relative',
  },
  navButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    zIndex: 1,
  },
  activePill: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    left: 8,
    borderRadius: 8,
    backgroundColor: '#2d76f9',
  },
  navButtonText: {
    color: '#c4d3eb',
    fontWeight: '600',
    fontSize: 12,
  },
  navButtonTextActive: {
    color: '#ffffff',
  },
  shareText: {
    fontWeight: '700',
  },
});
