import React, { type ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from './theme';

export function GlassCard({ children, reduceTransparency }: { children: ReactNode; reduceTransparency: boolean }) {
  return (
    <View style={styles.shadow}>
      <View style={[styles.clip, reduceTransparency && styles.solid]}>
        {!reduceTransparency && Platform.OS === 'ios' && (
          <BlurView pointerEvents="none" intensity={35} tint="light" style={StyleSheet.absoluteFill} />
        )}
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: { shadowColor: '#709DBF', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.12, shadowRadius: 28 },
  clip: { overflow: 'hidden', borderRadius: theme.radii.card, borderWidth: 1, borderColor: '#FFFFFF', backgroundColor: theme.colors.glass },
  solid: { backgroundColor: theme.colors.glassSolid },
  content: { padding: 24, gap: 15 },
});
