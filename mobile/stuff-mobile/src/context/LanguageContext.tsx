import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'pt' | 'en';

interface Translations {
  [key: string]: { pt: string; en: string };
}

const translations: Translations = {
  // Navigation
  nav_home: { pt: 'Início', en: 'Home' },
  nav_schools: { pt: 'Escolas', en: 'Schools' },
  nav_transport: { pt: 'Transporte', en: 'Transport' },
  nav_services: { pt: 'Serviços', en: 'Services' },
  nav_profile: { pt: 'Perfil', en: 'Profile' },
  
  // Auth
  login: { pt: 'Entrar', en: 'Sign In' },
  register: { pt: 'Cadastrar', en: 'Sign Up' },
  logout: { pt: 'Sair', en: 'Logout' },
  email: { pt: 'Email', en: 'Email' },
  password: { pt: 'Senha', en: 'Password' },
  forgot_password: { pt: 'Esqueci a senha', en: 'Forgot password' },
  
  // PIN
  enter_pin: { pt: 'Digite seu PIN', en: 'Enter your PIN' },
  setup_pin: { pt: 'Configure seu PIN', en: 'Setup your PIN' },
  confirm_pin: { pt: 'Confirme seu PIN', en: 'Confirm your PIN' },
  use_password: { pt: 'Usar senha', en: 'Use password' },
  use_biometrics: { pt: 'Usar biometria', en: 'Use biometrics' },
  
  // Schools
  schools_title: { pt: 'Escolas', en: 'Schools' },
  schools_subtitle: { pt: 'Encontre a escola perfeita', en: 'Find the perfect school' },
  view_courses: { pt: 'Ver Cursos', en: 'View Courses' },
  
  // Transport
  transport_title: { pt: 'Transporte', en: 'Transport' },
  leap_card: { pt: 'Leap Card', en: 'Leap Card' },
  
  // Common
  loading: { pt: 'Carregando...', en: 'Loading...' },
  error: { pt: 'Erro', en: 'Error' },
  success: { pt: 'Sucesso', en: 'Success' },
  cancel: { pt: 'Cancelar', en: 'Cancel' },
  confirm: { pt: 'Confirmar', en: 'Confirm' },
  save: { pt: 'Salvar', en: 'Save' },
  search: { pt: 'Buscar', en: 'Search' },
  filter: { pt: 'Filtrar', en: 'Filter' },
  all: { pt: 'Todos', en: 'All' },
  
  // Welcome
  welcome: { pt: 'Bem-vindo', en: 'Welcome' },
  welcome_back: { pt: 'Bem-vindo de volta', en: 'Welcome back' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('pt');

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
