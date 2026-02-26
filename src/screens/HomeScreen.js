import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen({ displayName, email, phone, stats }) {
  const kpis = [
    { id: 'people', label: 'People Shared', value: `${stats.totalPeopleShared}` },
    { id: 'today', label: 'Today', value: `${stats.todayShares}` },
    { id: 'success', label: 'Success Rate', value: `${stats.shareSuccessRate}%` },
    { id: 'streak', label: 'Streak', value: `${stats.activeStreakDays} days` },
  ];

  return (
    <View>
      <Text style={styles.screenTitle}>Home</Text>
      <Text style={styles.screenSubtitle}>Quick-glance share activity and operational updates.</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Performance Snapshot</Text>
        <View style={styles.kpiGrid}>
          {kpis.map((kpi) => (
            <View key={kpi.id} style={styles.kpiTile}>
              <Text style={styles.kpiValue}>{kpi.value}</Text>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Hotfix List ({stats.hotfixCount})</Text>
        {stats.hotfixList.map((item) => (
          <View key={item.id} style={styles.rowBetween}>
            <Text style={styles.previewLine}>{item.title}</Text>
            <Text style={[styles.badge, item.status === 'In QA' && styles.badgeMuted]}>
              {item.status}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Recent Shares</Text>
        {stats.recentShares.map((item) => (
          <View key={item.id} style={styles.rowBetween}>
            <Text style={styles.previewLine}>
              {item.name} - {item.method}
            </Text>
            <Text style={styles.cardMuted}>{item.timeAgo}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Ops At A Glance</Text>
        <Text style={styles.cardMuted}>Weekly goal: {stats.weeklyGoalPercent}% complete</Text>
        <Text style={styles.cardMuted}>Hotfixes deployed today: {stats.deployedToday}</Text>
        <Text style={styles.cardMuted}>
          Providers connected: {stats.connectedProviders} / 3
        </Text>
        <Text style={styles.cardMuted}>Default profile: {displayName}</Text>
        <Text style={styles.cardMuted}>{email}</Text>
        <Text style={styles.cardMuted}>{phone}</Text>
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
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  kpiTile: {
    width: '50%',
    padding: 4,
  },
  kpiValue: {
    color: '#f2f7ff',
    fontWeight: '700',
    fontSize: 18,
  },
  kpiLabel: {
    color: '#9eb1ce',
    marginTop: 2,
    fontSize: 12,
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badge: {
    color: '#08203f',
    backgroundColor: '#8bd2ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: '700',
  },
  badgeMuted: {
    backgroundColor: '#f3c16f',
  },
});
