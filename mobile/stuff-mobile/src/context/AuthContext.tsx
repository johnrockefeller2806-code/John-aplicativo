import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  plan?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasBiometrics: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithPin: (email: string, pin: string) => Promise<User>;
  loginWithBiometrics: () => Promise<boolean>;
  logout: () => Promise<void>;
  setupPin: (pin: string) => Promise<void>;
  checkBiometrics: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasBiometrics, setHasBiometrics] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    checkBiometricsAvailable();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const response = await authAPI.getProfile();
        setUser(response.data);
      }
    } catch (error) {
      await SecureStore.deleteItemAsync('token');
    } finally {
      setIsLoading(false);
    }
  };

  const checkBiometricsAvailable = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setHasBiometrics(compatible && enrolled);
  };

  const login = async (email: string, password: string): Promise<User> => {
    const response = await authAPI.login(email, password);
    const { access_token, user: userData } = response.data;
    
    await SecureStore.setItemAsync('token', access_token);
    await SecureStore.setItemAsync('lastEmail', email);
    setUser(userData);
    
    return userData;
  };

  const loginWithPin = async (email: string, pin: string): Promise<User> => {
    const response = await authAPI.loginWithPin(email, pin);
    const { access_token, user: userData } = response.data;
    
    await SecureStore.setItemAsync('token', access_token);
    await SecureStore.setItemAsync('lastEmail', email);
    setUser(userData);
    
    return userData;
  };

  const loginWithBiometrics = async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para continuar',
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Usar PIN',
      });
      
      if (result.success) {
        // Get stored credentials and login
        const email = await SecureStore.getItemAsync('lastEmail');
        const pin = await SecureStore.getItemAsync('userPin');
        
        if (email && pin) {
          await loginWithPin(email, pin);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Biometric auth error:', error);
      return false;
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    setUser(null);
  };

  const setupPin = async (pin: string) => {
    await authAPI.setupPin(pin);
    await SecureStore.setItemAsync('userPin', pin);
    await SecureStore.setItemAsync('pinEnabled', 'true');
  };

  const checkBiometrics = async (): Promise<boolean> => {
    return hasBiometrics;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        hasBiometrics,
        login,
        loginWithPin,
        loginWithBiometrics,
        logout,
        setupPin,
        checkBiometrics,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
