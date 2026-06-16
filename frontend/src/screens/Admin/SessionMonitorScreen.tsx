import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, RefreshControl, Alert } from 'react-native';
import { api } from '../../api/axios';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SessionMonitorScreen() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/admin/sessions');
      setSessions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSessions();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleEndSession = async (sessionId: string) => {
    try {
      await api.post(`/test/end/${sessionId}`);
      Alert.alert("Success", "Session ended successfully");
      fetchSessions();
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.detail || "Failed to end session");
    }
  };

  const activeSessions = sessions.filter(s => s.status === 'active');
  const pastSessions = sessions.filter(s => s.status !== 'active');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.title}>Session Monitor</Text>

        <Text style={styles.sectionTitle}>Active Sessions</Text>
        {activeSessions.length === 0 ? (
          <Text style={styles.emptyText}>No active sessions</Text>
        ) : (
          activeSessions.map((session) => (
            <Card key={session.id}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionStatusActive}>{session.status.toUpperCase()}</Text>
                <Text style={styles.sessionDate}>
                  {new Date(session.started_at).toLocaleTimeString()}
                </Text>
              </View>
              <Text style={styles.sessionDetail}>Player ID: {session.player_id}</Text>
              <Text style={styles.sessionDetail}>Device: {session.device_id}</Text>
              <Button 
                title="End Session" 
                variant="danger" 
                onPress={() => handleEndSession(session.id)}
                style={styles.endButton}
              />
            </Card>
          ))
        )}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recent Sessions</Text>
        {pastSessions.slice(0, 10).map((session) => (
          <Card key={session.id}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionStatus}>{session.status.toUpperCase()}</Text>
              <Text style={styles.sessionDate}>
                {new Date(session.started_at).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.sessionDetail}>Player ID: {session.player_id}</Text>
            <Text style={styles.sessionDetail}>Ended: {session.ended_at ? new Date(session.ended_at).toLocaleTimeString() : 'N/A'}</Text>
          </Card>
        ))}
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sessionStatusActive: {
    fontWeight: '700',
    color: '#10B981',
  },
  sessionStatus: {
    fontWeight: '600',
    color: '#6B7280',
  },
  sessionDate: {
    color: '#6B7280',
    fontSize: 14,
  },
  sessionDetail: {
    color: '#4B5563',
    marginBottom: 4,
    fontSize: 12,
  },
  endButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
});
