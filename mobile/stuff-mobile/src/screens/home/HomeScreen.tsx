import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ShamrockIcon, HarpIcon, FourLeafClover } from '../../components';
import { colors, shadows } from '../../theme';

const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();

  const quickActions = [
    {
      icon: 'school',
      label: language === 'pt' ? 'Escolas' : 'Schools',
      screen: 'Schools',
      gradient: ['#059669', '#10b981'],
    },
    {
      icon: 'bus',
      label: language === 'pt' ? 'Transporte' : 'Transport',
      screen: 'Transport',
      gradient: ['#3b82f6', '#60a5fa'],
    },
    {
      icon: 'document-text',
      label: language === 'pt' ? 'Documentos' : 'Documents',
      screen: 'Services',
      gradient: ['#8b5cf6', '#a78bfa'],
    },
    {
      icon: 'chatbubbles',
      label: language === 'pt' ? 'Comunidade' : 'Community',
      screen: 'Chat',
      gradient: ['#0d9488', '#14b8a6'],
    },
  ];

  const features = [
    {
      icon: 'shield-checkmark',
      title: language === 'pt' ? 'Escolas Certificadas' : 'Certified Schools',
      desc: language === 'pt' ? 'Todas ACELS aprovadas' : 'All ACELS approved',
    },
    {
      icon: 'card',
      title: language === 'pt' ? 'Pagamento Seguro' : 'Secure Payment',
      desc: language === 'pt' ? 'Via Stripe' : 'Via Stripe',
    },
    {
      icon: 'headset',
      title: language === 'pt' ? 'Suporte 24/7' : '24/7 Support',
      desc: language === 'pt' ? 'Sempre disponível' : 'Always available',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#064e3b', '#047857', '#0d9488']}
        style={styles.hero}
      >
        {/* Decorations */}
        <ShamrockIcon size={150} color="rgba(255,255,255,0.1)" style={styles.shamrock1} />
        <ShamrockIcon size={80} color="rgba(255,255,255,0.05)" style={styles.shamrock2} />
        <HarpIcon size={80} color="rgba(245,158,11,0.1)" style={styles.harp} />
        <FourLeafClover size={60} color="rgba(255,255,255,0.05)" style={styles.clover} />

        <View style={styles.heroContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBg}>
              <ShamrockIcon size={32} color="#fff" />
            </View>
            <Text style={styles.logoText}>STUFF</Text>
          </View>

          {/* Title */}
          <Text style={styles.heroTitle}>
            {language === 'pt' ? 'Estude na ' : 'Study in '}
            <Text style={styles.heroHighlight}>
              {language === 'pt' ? 'Irlanda' : 'Ireland'}
            </Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            {language === 'pt'
              ? 'Conectamos você diretamente às melhores escolas de Dublin, Cork e Galway'
              : 'We connect you directly to the best schools in Dublin, Cork and Galway'}
          </Text>

          {/* CTA Button */}
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Schools')}
          >
            <LinearGradient
              colors={['#f59e0b', '#ea580c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Ionicons name="school" size={20} color="#fff" />
              <Text style={styles.ctaText}>
                {language === 'pt' ? 'Ver Escolas' : 'View Schools'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>15+</Text>
              <Text style={styles.statLabel}>
                {language === 'pt' ? 'Escolas' : 'Schools'}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>
                {language === 'pt' ? 'Cidades' : 'Cities'}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>4.9★</Text>
              <Text style={styles.statLabel}>
                {language === 'pt' ? 'Avaliação' : 'Rating'}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <ShamrockIcon size={20} color={colors.primary[600]} />
          {'  '}
          {language === 'pt' ? 'Acesso Rápido' : 'Quick Access'}
        </Text>
        <View style={styles.quickActions}>
          {quickActions.map((action, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.quickAction}
              onPress={() => navigation.navigate(action.screen)}
            >
              <LinearGradient
                colors={action.gradient}
                style={styles.quickActionIcon}
              >
                <Ionicons name={action.icon as any} size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {language === 'pt' ? 'Por que escolher a STUFF?' : 'Why choose STUFF?'}
        </Text>
        <View style={styles.features}>
          {features.map((feature, idx) => (
            <View key={idx} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon as any} size={24} color={colors.primary[600]} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Irish Flag Bar */}
      <View style={styles.flagBar}>
        <View style={[styles.flagSegment, { backgroundColor: colors.primary[600] }]} />
        <View style={[styles.flagSegment, { backgroundColor: '#fff' }]} />
        <View style={[styles.flagSegment, { backgroundColor: colors.secondary[500] }]} />
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaSectionTitle}>
          {language === 'pt' ? 'Pronto para começar?' : 'Ready to start?'}
        </Text>
        <Text style={styles.ctaSectionSubtitle}>
          {language === 'pt'
            ? 'Explore nossas escolas parceiras e comece sua jornada na Irlanda!'
            : 'Explore our partner schools and start your journey in Ireland!'}
        </Text>
        <TouchableOpacity
          style={styles.ctaSectionButton}
          onPress={() => navigation.navigate('Schools')}
        >
          <ShamrockIcon size={20} color="#fff" />
          <Text style={styles.ctaSectionButtonText}>
            {language === 'pt' ? 'Explorar Escolas' : 'Explore Schools'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  hero: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
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
    bottom: 40,
    right: 10,
  },
  clover: {
    position: 'absolute',
    bottom: 80,
    left: 20,
  },
  heroContent: {
    position: 'relative',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  logoBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroHighlight: {
    color: '#fbbf24',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 12,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    gap: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...shadows.md,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[800],
  },
  features: {
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 16,
    ...shadows.sm,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: colors.gray[500],
  },
  flagBar: {
    flexDirection: 'row',
    height: 8,
    marginHorizontal: 24,
    borderRadius: 4,
    overflow: 'hidden',
  },
  flagSegment: {
    flex: 1,
  },
  ctaSection: {
    margin: 24,
    backgroundColor: colors.primary[50],
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  ctaSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 8,
  },
  ctaSectionSubtitle: {
    fontSize: 14,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaSectionButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary[600],
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    gap: 8,
  },
  ctaSectionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
