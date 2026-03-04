/**
 * ErrorBoundary — Graceful crash UI (ROADMAP Phase 0).
 * Catches render errors in child tree and shows fallback instead of white screen.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { THEMES, Spacing, FontSize } from '@/constants/theme';
import { logger } from '@/utils/logger';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('UI', 'ErrorBoundary caught render error', { error: error.message, stack: errorInfo.componentStack });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>{this.state.error.message}</Text>
          <TouchableOpacity style={styles.button} onPress={this.handleRetry} accessibilityRole="button" accessibilityLabel="Try again">
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const fallbackPalette = THEMES.dark;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: fallbackPalette.bgApp,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: fallbackPalette.textPrimary,
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: FontSize.sm,
    color: fallbackPalette.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  button: {
    backgroundColor: fallbackPalette.accentPrimary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  buttonText: {
    color: fallbackPalette.white,
    fontWeight: '600',
    fontSize: FontSize.base,
  },
});
