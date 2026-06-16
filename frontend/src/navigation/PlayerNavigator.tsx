import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { User, QrCode, History } from 'lucide-react-native';

import ProfileScreen from '../screens/Player/ProfileScreen';
import QRIdentityScreen from '../screens/Player/QRIdentityScreen';
import HistoryScreen from '../screens/Player/HistoryScreen';

const Tab = createBottomTabNavigator();

export const PlayerNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Profile') {
            return <User color={color} size={size} />;
          } else if (route.name === 'QRIdentity') {
            return <QrCode color={color} size={size} />;
          } else if (route.name === 'History') {
            return <History color={color} size={size} />;
          }
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="QRIdentity" component={QRIdentityScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
};
