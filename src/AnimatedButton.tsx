import React, { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from './theme';

type Props = {
  label: string;
  onPress: () => void;
  reduceMotion: boolean;
  variant?: 'primary' | 'google' | 'apple';
  pulse?: boolean;
};

export function AnimatedButton({ label, onPress, reduceMotion, variant = 'primary', pulse = false }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scale.setValue(1);
    glow.setValue(0);
    if (reduceMotion || !pulse) return;
    // A brief welcome cue, never an endlessly pulsing control.
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 950, useNativeDriver: true }),
      Animated.timing(glow, { toValue: 0, duration: 950, useNativeDriver: true }),
    ]), { iterations: 2 });
    animation.start();
    return () => animation.stop();
  }, [reduceMotion, pulse, glow, scale]);

  const animate = (toValue: number) => {
    if (!reduceMotion) {
      Animated.spring(scale, { toValue, damping: 18, stiffness: 240, useNativeDriver: true }).start();
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      {variant === 'primary' && (
        <Animated.View pointerEvents="none" style={[styles.halo, { opacity: glow }]} />
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPressIn={() => animate(0.975)}
        onPressOut={() => animate(1)}
        onPress={() => {
          if (Platform.OS !== 'web') void Haptics.selectionAsync().catch(() => {});
          onPress();
        }}
        style={({ pressed }) => [styles.button, styles[variant], pressed && styles.pressed]}
      >
        <View style={styles.labelWrap}>
          <Text style={[styles.label, variant === 'primary' && styles.primaryLabel, variant === 'apple' && styles.appleLabel]}>{label}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 56, borderRadius: theme.radii.button, paddingHorizontal: 18, paddingVertical: 14, justifyContent: 'center', borderWidth: 1 },
  primary: { backgroundColor: theme.colors.orange, borderColor: '#FFAE75', shadowColor: theme.colors.orange, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.18, shadowRadius: 16, elevation: 2 },
  google: { backgroundColor: 'rgba(255,255,255,0.88)', borderColor: theme.colors.line },
  apple: { backgroundColor: '#111111', borderColor: '#111111' },
  pressed: { opacity: 0.88 },
  labelWrap: { alignItems: 'center' },
  label: { fontSize: 16, lineHeight: 23, fontWeight: '600', color: theme.colors.ink, textAlign: 'center' },
  // Dark text maintains contrast on orange, including at smaller font sizes.
  primaryLabel: { color: '#2A190C' },
  appleLabel: { color: theme.colors.white },
  halo: { position: 'absolute', top: -7, bottom: -7, left: -7, right: -7, borderRadius: 25, backgroundColor: 'rgba(255,151,68,0.19)' },
});
