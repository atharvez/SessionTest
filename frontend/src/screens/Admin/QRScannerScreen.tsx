import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { api } from '../../api/axios';
import { Button } from '../../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QRScannerScreen({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    try {
      const response = await api.post('/qr/scan', {
        qr_token: data,
        device_id: 'scanner-device-01'
      });
      Alert.alert(
        "Scan Successful",
        `Session created for ${response.data.player?.name || 'Player'}`,
        [{ text: "OK", onPress: () => setScanned(false) }]
      );
    } catch (error: any) {
      Alert.alert(
        "Scan Failed",
        error.response?.data?.detail || "Invalid QR Code or player has active session",
        [{ text: "OK", onPress: () => setScanned(false) }]
      );
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan QR Identity</Text>
        <Text style={styles.subtitle}>Point camera at a player's QR code</Text>
      </View>
      <View style={styles.cameraContainer}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
        </View>
      </View>
      {scanned && (
        <Button 
          title={'Tap to Scan Again'} 
          onPress={() => setScanned(false)} 
          style={styles.scanButton}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    paddingBottom: 0,
    marginBottom: 20,
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
  cameraContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#3B82F6',
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  scanButton: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
});
