import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, shadows, borderRadius } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card = ({ children, style, variant = 'default' }: CardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return { ...shadows.lg, backgroundColor: colors.white };
      case 'outlined':
        return { borderWidth: 1, borderColor: colors.gray[200], backgroundColor: colors.white };
      default:
        return { ...shadows.md, backgroundColor: colors.white };
    }
  };

  return (
    <View style={[styles.card, getVariantStyles(), style]}>
      {children}
    </View>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const CardHeader = ({ title, subtitle, icon, action }: CardHeaderProps) => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
    {action && <View>{action}</View>}
  </View>
);

export const CardContent = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.content, style]}>{children}</View>
);

export const CardFooter = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.footer, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 2,
  },
  content: {
    padding: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
});
