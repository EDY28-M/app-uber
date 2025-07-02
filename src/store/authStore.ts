import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User } from '../types';

// Mock authentication - en producción esto sería una API real
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    phone: '+51 987654321',
    createdAt: new Date('2024-12-15'),
    rating: 4.8,
    totalTrips: 12
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Simulación de login
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user = mockUsers.find(u => u.email === email);
          if (user && password === '123456') {
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error('Credenciales incorrectas');
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData: Partial<User>) => {
        set({ isLoading: true });
        try {
          // Simulación de registro
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newUser: User = {
            id: Date.now().toString(),
            name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            createdAt: new Date(),
            rating: 5.0,
            totalTrips: 0
          };
          
          mockUsers.push(newUser);
          set({ user: newUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          set({ user: updatedUser });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
