import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/axios';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'player';
  qr_token?: string;
  profile_image?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  login: async (token, user) => {
    await AsyncStorage.setItem('token', token);
    set({ token, user, isLoading: false });
  },
  logout: async () => {
    await AsyncStorage.removeItem('token');
    set({ token: null, user: null, isLoading: false });
  },
  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await api.get('/player/me');
        set({ token, user: response.data, isLoading: false });
      } else {
        set({ token: null, user: null, isLoading: false });
      }
    } catch (error) {
      await AsyncStorage.removeItem('token');
      set({ token: null, user: null, isLoading: false });
    }
  },
}));
