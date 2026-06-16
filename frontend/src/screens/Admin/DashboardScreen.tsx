import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, RefreshControl } from 'react-native';
import { api } from '../../api/axios';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Activity } from 'lucide-react-native';

export default function DashboardScreen() {
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState({ totalPlayers: 0, activeSessions: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const [playersRes, sessionsRes] = await Promise.all([
        api.get('/admin/players'),
        api.get('/admin/sessions')
      ]);
      
      const active = sessionsRes.data.filter((s: any) => s.status === 'active').length;
      setStats({
        totalPlayers: playersRes.data.length,
        activeSessions: active
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back, {user?.name}</Text>
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Users size={32} color="#3B82F6" />
            <Text style={styles.statValue}>{stats.totalPlayers}</Text>
            <Text style={styles.statLabel}>Total Players</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Activity size={32} color="#10B981" />
            <Text style={styles.statValue}>{stats.activeSessions}</Text>
            <Text style={styles.statLabel}>Active Sessions</Text>
          </Card>
        </View>

        <Button
          title="Sign Out"
          variant="danger"
          onPress={logout}
          style={styles.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    paddingVertical: 24,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  logoutButton: {
    marginTop: 'auto',
  },
});
