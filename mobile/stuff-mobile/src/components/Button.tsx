import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 };
      case 'lg':
        return { paddingVertical: 18, paddingHorizontal: 32, fontSize: 18 };
      default:
        return { paddingVertical: 14, paddingHorizontal: 24, fontSize: 16 };
    }
  };

  const sizeStyles = getSizeStyles();

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[styles.buttonBase, { opacity: isDisabled ? 0.6 : 1 }, style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#059669', '#0d9488']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gradient,
            { paddingVertical: sizeStyles.paddingVertical, paddingHorizontal: sizeStyles.paddingHorizontal },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              {icon}
              <Text style={[styles.textPrimary, { fontSize: sizeStyles.fontSize }, textStyle]}>
                {title}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[styles.buttonBase, { opacity: isDisabled ? 0.6 : 1 }, style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#f59e0b', '#ea580c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gradient,
            { paddingVertical: sizeStyles.paddingVertical, paddingHorizontal: sizeStyles.paddingHorizontal },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              {icon}
              <Text style={[styles.textPrimary, { fontSize: sizeStyles.fontSize }, textStyle]}>
                {title}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[
          styles.buttonBase,
          styles.outline,
          {
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            opacity: isDisabled ? 0.6 : 1,
          },
          style,
        ]}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary[600]} />
        ) : (
          <>
            {icon}
            <Text style={[styles.textOutline, { fontSize: sizeStyles.fontSize }, textStyle]}>
              {title}
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  }

  // Ghost variant
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.buttonBase,
        styles.ghost,
        {
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          opacity: isDisabled ? 0.6 : 1,
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary[600]} />
      ) : (
        <>
          {icon}
          <Text style={[styles.textGhost, { fontSize: sizeStyles.fontSize }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  outline: {
    borderWidth: 2,
    borderColor: colors.primary[600],
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ghost: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  textPrimary: {
    color: '#fff',
    fontWeight: '600',
  },
  textOutline: {
    color: colors.primary[600],
    fontWeight: '600',
  },
  textGhost: {
    color: colors.primary[600],
    fontWeight: '600',
  },
});
