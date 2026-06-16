import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Camera, Monitor } from 'lucide-react-native';

import DashboardScreen from '../screens/Admin/DashboardScreen';
import QRScannerScreen from '../screens/Admin/QRScannerScreen';
import SessionMonitorScreen from '../screens/Admin/SessionMonitorScreen';

const Tab = createBottomTabNavigator();

export const AdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Dashboard') {
            return <Home color={color} size={size} />;
          } else if (route.name === 'QRScanner') {
            return <Camera color={color} size={size} />;
          } else if (route.name === 'Sessions') {
            return <Monitor color={color} size={size} />;
          }
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="QRScanner" component={QRScannerScreen} />
      <Tab.Screen name="Sessions" component={SessionMonitorScreen} />
    </Tab.Navigator>
  );
};
