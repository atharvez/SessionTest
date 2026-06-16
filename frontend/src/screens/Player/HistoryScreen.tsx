import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, RefreshControl } from 'react-native';
import { api } from '../../api/axios';
import { Card } from '../../components/Card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

export default function HistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/player/history');
      setHistory(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Generate mock data for the chart based on sessions
  // In a real app, this would use actual metrics from test results
  const chartData = history.map((session, index) => ({
    x: index + 1,
    y: Math.random() * 100 // Mock score
  })).reverse();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.title}>Test History</Text>

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Performance Trend</Text>
          {chartData.length > 0 ? (
            <View pointerEvents="none">
              <VictoryChart theme={VictoryTheme.material} height={250} padding={{ top: 20, bottom: 40, left: 40, right: 20 }}>
                <VictoryAxis 
                  tickFormat={(t: any) => `T${t}`} 
                  style={{ tickLabels: { fontSize: 10, fill: '#6B7280' } }}
                />
                <VictoryAxis 
                  dependentAxis 
                  style={{ tickLabels: { fontSize: 10, fill: '#6B7280' } }}
                />
                <VictoryLine
                  style={{
                    data: { stroke: "#3B82F6", strokeWidth: 3 },
                    parent: { border: "1px solid #ccc"}
                  }}
                  data={chartData}
                  animate={{ duration: 500, onLoad: { duration: 500 } }}
                />
              </VictoryChart>
            </View>
          ) : (
            <Text style={styles.emptyText}>No test history available.</Text>
          )}
        </Card>

        {history.map((session) => (
          <Card key={session.id}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionStatus}>{session.status.toUpperCase()}</Text>
              <Text style={styles.sessionDate}>
                {new Date(session.started_at).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.sessionDetail}>Started: {new Date(session.started_at).toLocaleTimeString()}</Text>
            {session.ended_at && (
              <Text style={styles.sessionDetail}>Ended: {new Date(session.ended_at).toLocaleTimeString()}</Text>
            )}
          </Card>
        ))}

        {history.length === 0 && (
          <Text style={styles.emptyText}>You haven't completed any tests yet.</Text>
        )}
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
  chartCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sessionStatus: {
    fontWeight: '600',
    color: '#3B82F6',
  },
  sessionDate: {
    color: '#6B7280',
    fontSize: 14,
  },
  sessionDetail: {
    color: '#4B5563',
    marginBottom: 4,
  },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 20,
  },
});
