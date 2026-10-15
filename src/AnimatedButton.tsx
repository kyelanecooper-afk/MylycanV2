import React, { useEffect, useRef } from 'react';
import { Animated, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from './theme';
import { GOOGLE_G_DATA_URI } from './googleG';

type Props = {
  label: string;
  onPress: () => void;
  reduceMotion: boolean;
  variant?: 'primary' | 'google' | 'apple';
  pulse?: boolean;
  disabled?: boolean;
};

export function AnimatedButton({ label, onPress, reduceMotion, variant = 'primary', pulse = false, disabled = false }: Props) {
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
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPressIn={() => !disabled && animate(0.975)}
        onPressOut={() => animate(1)}
        onPress={() => {
          if (disabled) return;
          if (Platform.OS !== 'web') void Haptics.selectionAsync().catch(() => {});
          onPress();
        }}
        style={({ pressed }) => [styles.button, styles[variant], pressed && !disabled && styles.pressed, disabled && styles.disabled]}
      >
        <View style={[styles.labelWrap, (variant === 'apple' || variant === 'google') && styles.providerLabelWrap]}>
          {variant === 'apple' && <Text accessible={false} style={styles.appleLogo}></Text>}
          {variant === 'google' && (
            <Image accessible={false} source={{ uri: GOOGLE_G_DATA_URI }} resizeMode="contain" style={styles.googleLogo} />
          )}
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
  disabled: { opacity: 0.48, shadowOpacity: 0, elevation: 0 },
  labelWrap: { alignItems: 'center' },
  providerLabelWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  appleLogo: { position: 'absolute', left: 3, color: theme.colors.white, fontSize: 22, lineHeight: 25 },
  googleLogo: { position: 'absolute', left: 3, width: 20, height: 20 },
  label: { fontSize: 16, lineHeight: 23, fontWeight: '600', color: theme.colors.ink, textAlign: 'center' },
  // Dark text maintains contrast on orange, including at smaller font sizes.
  primaryLabel: { color: '#2A190C' },
  appleLabel: { color: theme.colors.white },
  halo: { position: 'absolute', top: -7, bottom: -7, left: -7, right: -7, borderRadius: 25, backgroundColor: 'rgba(255,151,68,0.19)' },
});
