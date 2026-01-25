import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components';
import { ShamrockIcon, HarpIcon, IrishFlagBar } from '../../components/IrishVectors';
import { colors } from '../../theme';

const { width } = Dimensions.get('window');

type Step = 'email' | 'pin' | 'password';

export const LoginScreen = ({ navigation }: any) => {
  const { login, loginWithPin, loginWithBiometrics, hasBiometrics } = useAuth();
  const { t, language } = useLanguage();
  
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [hasPin, setHasPin] = useState(false);
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const pinRefs = useRef<Array<TextInput | null>>([]);

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      setError(language === 'pt' ? 'Digite seu email' : 'Enter your email');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // For now, go to password step (we can implement PIN check later)
      setStep('password');
    } catch (err) {
      setError(language === 'pt' ? 'Erro ao verificar email' : 'Error checking email');
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError('');
    
    if (value && index < 5) {
      pinRefs.current[index + 1]?.focus();
    }
    
    // Auto submit when complete
    if (newPin.every(d => d !== '')) {
      handlePinLogin(newPin.join(''));
    }
  };

  const handlePinKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
      const newPin = [...pin];
      newPin[index - 1] = '';
      setPin(newPin);
    }
  };

  const handlePinLogin = async (pinCode: string) => {
    setLoading(true);
    
    try {
      await loginWithPin(email, pinCode);
      // Navigation will be handled by auth state change
    } catch (err: any) {
      setError(language === 'pt' ? 'PIN incorreto' : 'Incorrect PIN');
      setPin(['', '', '', '', '', '']);
      pinRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!password) {
      setError(language === 'pt' ? 'Digite sua senha' : 'Enter your password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      // Navigation will be handled by auth state change
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometrics = async () => {
    const success = await loginWithBiometrics();
    if (!success) {
      Alert.alert(
        language === 'pt' ? 'Erro' : 'Error',
        language === 'pt' ? 'Autenticação biométrica falhou' : 'Biometric authentication failed'
      );
    }
  };

  return (
    <LinearGradient
      colors={['#064e3b', '#047857', '#0d9488']}
      style={styles.container}
    >
      {/* Decorative Elements */}
      <View style={styles.decorations}>
        <ShamrockIcon size={120} color="rgba(255,255,255,0.1)" style={styles.shamrock1} />
        <ShamrockIcon size={80} color="rgba(255,255,255,0.05)" style={styles.shamrock2} />
        <HarpIcon size={60} color="rgba(245,158,11,0.1)" style={styles.harp} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBg}>
              <ShamrockIcon size={48} color="#fff" />
            </View>
            <Text style={styles.logoText}>STUFF</Text>
            <Text style={styles.logoSubtext}>
              {language === 'pt' ? 'Intercâmbio' : 'Exchange'}
            </Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {/* Irish Flag Bar */}
            <IrishFlagBar width={width - 64} height={4} style={styles.flagBar} />

            {/* Email Step */}
            {step === 'email' && (
              <View style={styles.stepContent}>
                <View style={styles.iconCircle}>
                  <Ionicons name="person" size={32} color={colors.primary[600]} />
                </View>
                <Text style={styles.title}>{t('login')}</Text>
                <Text style={styles.subtitle}>
                  {language === 'pt' ? 'Digite seu email para continuar' : 'Enter your email to continue'}
                </Text>

                <View style={styles.inputContainer}>
                  <Ionicons name="mail" size={20} color={colors.gray[400]} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="seu@email.com"
                    placeholderTextColor={colors.gray[400]}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <Button
                  title={language === 'pt' ? 'Continuar' : 'Continue'}
                  onPress={handleEmailSubmit}
                  loading={loading}
                  style={styles.button}
                  icon={<Ionicons name="arrow-forward" size={20} color="#fff" />}
                />

                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={styles.linkText}>
                    {language === 'pt' ? 'Não tem conta? ' : "Don't have an account? "}
                    <Text style={styles.linkTextBold}>
                      {language === 'pt' ? 'Cadastre-se' : 'Sign up'}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* PIN Step */}
            {step === 'pin' && (
              <View style={styles.stepContent}>
                <View style={[styles.iconCircle, styles.iconCircleGreen]}>
                  <Text style={styles.avatarText}>
                    {userName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.title}>
                  {language === 'pt' ? `Olá, ${userName}!` : `Hello, ${userName}!`}
                </Text>
                <Text style={styles.subtitle}>{email}</Text>
                <TouchableOpacity onPress={() => setStep('email')}>
                  <Text style={styles.changeEmail}>
                    {language === 'pt' ? 'Não é você?' : 'Not you?'}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.pinLabel}>{t('enter_pin')}</Text>

                <View style={styles.pinContainer}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (pinRefs.current[index] = ref)}
                      style={[
                        styles.pinInput,
                        pin[index] && styles.pinInputFilled,
                        error && styles.pinInputError,
                      ]}
                      value={pin[index]}
                      onChangeText={(value) => handlePinChange(index, value)}
                      onKeyPress={({ nativeEvent }) => handlePinKeyPress(index, nativeEvent.key)}
                      keyboardType="number-pad"
                      maxLength={1}
                      secureTextEntry
                    />
                  ))}
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity onPress={() => setStep('password')} style={styles.linkButton}>
                  <Ionicons name="key" size={16} color={colors.gray[500]} />
                  <Text style={styles.linkTextSmall}>{t('use_password')}</Text>
                </TouchableOpacity>

                {hasBiometrics && (
                  <TouchableOpacity onPress={handleBiometrics} style={styles.biometricButton}>
                    <Ionicons name="finger-print" size={24} color={colors.primary[600]} />
                    <Text style={styles.biometricText}>{t('use_biometrics')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Password Step */}
            {step === 'password' && (
              <View style={styles.stepContent}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setStep('email')}
                >
                  <Ionicons name="arrow-back" size={20} color={colors.gray[600]} />
                  <Text style={styles.backText}>
                    {language === 'pt' ? 'Voltar' : 'Back'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.iconCircle}>
                  <Ionicons name="lock-closed" size={32} color={colors.primary[600]} />
                </View>
                <Text style={styles.title}>
                  {language === 'pt' ? 'Digite sua senha' : 'Enter your password'}
                </Text>
                <Text style={styles.subtitle}>{email}</Text>

                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} color={colors.gray[400]} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={colors.gray[400]}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={colors.gray[400]}
                    />
                  </TouchableOpacity>
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <Button
                  title={t('login')}
                  onPress={handlePasswordLogin}
                  loading={loading}
                  style={styles.button}
                  icon={<Ionicons name="arrow-forward" size={20} color="#fff" />}
                />

                <TouchableOpacity style={styles.linkButton}>
                  <Text style={styles.linkTextSmall}>
                    {t('forgot_password')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Security Badge */}
          <View style={styles.securityBadge}>
            <Ionicons name="shield-checkmark" size={16} color="rgba(255,255,255,0.6)" />
            <Text style={styles.securityText}>
              {language === 'pt' ? 'Conexão segura' : 'Secure connection'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorations: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  shamrock1: {
    position: 'absolute',
    top: -30,
    left: -30,
  },
  shamrock2: {
    position: 'absolute',
    top: 100,
    right: 20,
  },
  harp: {
    position: 'absolute',
    bottom: 100,
    right: 30,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoSubtext: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  flagBar: {
    alignSelf: 'center',
    marginTop: 0,
  },
  stepContent: {
    padding: 24,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconCircleGreen: {
    backgroundColor: colors.primary[600],
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 4,
  },
  changeEmail: {
    fontSize: 14,
    color: colors.primary[600],
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
    marginTop: 16,
    width: '100%',
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.gray[900],
  },
  eyeButton: {
    padding: 16,
  },
  button: {
    width: '100%',
    marginTop: 24,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  linkText: {
    fontSize: 14,
    color: colors.gray[500],
  },
  linkTextBold: {
    color: colors.primary[600],
    fontWeight: '600',
  },
  linkTextSmall: {
    fontSize: 14,
    color: colors.gray[500],
  },
  pinLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: 16,
  },
  pinContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  pinInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray[200],
    backgroundColor: colors.gray[50],
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.gray[900],
  },
  pinInputFilled: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  pinInputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.primary[50],
    borderRadius: 16,
    gap: 8,
  },
  biometricText: {
    fontSize: 16,
    color: colors.primary[600],
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
    gap: 4,
  },
  backText: {
    fontSize: 14,
    color: colors.gray[600],
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 6,
  },
  securityText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
});
