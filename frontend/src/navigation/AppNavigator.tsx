import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/useAuthStore';
import { ActivityIndicator, View } from 'react-native';

// Dummy imports, will create them next
import { AuthNavigator } from './AuthNavigator';
import { PlayerNavigator } from './PlayerNavigator';
import { AdminNavigator } from './AdminNavigator';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { user, token, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token == null ? (
          // No token found, user isn't signed in
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : user?.role === 'admin' ? (
          // User is signed in as admin
          <Stack.Screen name="Admin" component={AdminNavigator} />
        ) : (
          // User is signed in as player
          <Stack.Screen name="Player" component={PlayerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
