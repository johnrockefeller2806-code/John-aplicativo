import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';
import { LoginScreen, HomeScreen, SchoolsScreen } from './src/screens';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator for authenticated users
const MainTabs = () => {
  const { language } = useLanguage();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Schools':
              iconName = focused ? 'school' : 'school-outline';
              break;
            case 'Transport':
              iconName = focused ? 'bus' : 'bus-outline';
              break;
            case 'Services':
              iconName = focused ? 'document-text' : 'document-text-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }
          
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: language === 'pt' ? 'Início' : 'Home',
        }}
      />
      <Tab.Screen
        name="Schools"
        component={SchoolsScreen}
        options={{
          tabBarLabel: language === 'pt' ? 'Escolas' : 'Schools',
        }}
      />
      <Tab.Screen
        name="Transport"
        component={HomeScreen} // Placeholder - criar TransportScreen
        options={{
          tabBarLabel: language === 'pt' ? 'Transporte' : 'Transport',
        }}
      />
      <Tab.Screen
        name="Services"
        component={HomeScreen} // Placeholder - criar ServicesScreen
        options={{
          tabBarLabel: language === 'pt' ? 'Serviços' : 'Services',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={HomeScreen} // Placeholder - criar ProfileScreen
        options={{
          tabBarLabel: language === 'pt' ? 'Perfil' : 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

// Main Navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // TODO: Add splash screen
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Auth Stack
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
          {/* <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
        </>
      ) : (
        // Main App Stack
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          {/* Add modal screens here */}
          {/* <Stack.Screen name="SchoolDetail" component={SchoolDetailScreen} options={{ presentation: 'modal' }} /> */}
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
