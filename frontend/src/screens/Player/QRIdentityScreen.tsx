import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuthStore } from '../../store/useAuthStore';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { api } from '../../api/axios';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QRIdentityScreen() {
  const { user, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const regenerateQR = async () => {
    setLoading(true);
    try {
      await api.post('/qr/regenerate');
      await checkAuth(); // Refresh user data to get new QR
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Identity</Text>
        <Text style={styles.subtitle}>Show this QR code to the admin to start a test session.</Text>

        <Card style={styles.qrCard}>
          {user?.qr_token ? (
            <View style={styles.qrContainer}>
              <QRCode
                value={user.qr_token}
                size={220}
                color="black"
                backgroundColor="white"
              />
            </View>
          ) : (
            <Text style={styles.noTokenText}>No QR token generated yet.</Text>
          )}
        </Card>

        <Button
          title="Regenerate QR"
          variant="secondary"
          onPress={regenerateQR}
          loading={loading}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  qrCard: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    width: '100%',
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  noTokenText: {
    color: '#6B7280',
    textAlign: 'center',
  },
  button: {
    width: '100%',
  },
});
