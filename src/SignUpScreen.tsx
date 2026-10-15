import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as AppleAuthentication from 'expo-apple-authentication';
import { AnimatedButton } from './AnimatedButton';
import { GlassCard } from './GlassCard';
import { validateSignup, type SignupErrors } from './authPreview';
import { theme } from './theme';
import { useAccessibilityPreferences } from './useAccessibilityPreferences';

export function SignUpScreen() {
  const { height } = useWindowDimensions();
  const { reduceMotion, reduceTransparency } = useAccessibilityPreferences();
  const [appleAvailable, setAppleAvailable] = useState(false);
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [notice, setNotice] = useState('');
  const passwordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    let active = true;
    if (Platform.OS === 'ios') {
      void AppleAuthentication.isAvailableAsync().then(value => {
        if (active) setAppleAvailable(value);
      }).catch(() => {});
    }
    return () => { active = false; };
  }, []);

  function providerPreview(provider: 'Apple' | 'Google') {
    Alert.alert(`Continue with ${provider}`, 'This is the signup screen preview. Account sign-in will be connected in the next stage; no account has been created.');
  }

  function submitPreview() {
    const nextErrors = validateSignup(email, password);
    setErrors(nextErrors);
    setNotice('');
    if (Object.keys(nextErrors).length === 0) {
      setPassword('');
      setShowPassword(false);
      setNotice('Your form looks ready. This preview has not created an account or saved your details.');
    }
  }

  return (
    <View style={styles.screen}>
      <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={StyleSheet.absoluteFill}>
        <LinearGradient colors={['#FFFFFF', '#EDF7FF', '#D8ECFF', '#F8FCFF']} locations={[0, 0.35, 0.72, 1]} style={StyleSheet.absoluteFill} />
        <View style={styles.blueOrb} />
        <View style={styles.whiteWave} />
        <View style={styles.lowerWave} />
      </View>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.frame}>
              <Text style={styles.preview}>SIGNUP SCREEN · DESIGN PREVIEW</Text>
              <View style={[styles.brandArea, height < 740 && styles.compactBrand]}>
                <Text style={styles.brand} accessibilityLabel="My Lycan">MY LYCAN</Text>
                <Text style={styles.brandSub}>A little more care, made personal.</Text>
              </View>
              <GlassCard reduceTransparency={reduceTransparency}>
                <View style={styles.heading}>
                  <Text accessibilityRole="header" style={styles.title}>Welcome to My Lycan</Text>
                  <Text style={styles.description}>Your vehicles, your care, all together.</Text>
                </View>
                <View style={styles.actions}>
                  {appleAvailable ? (
                    <AppleAuthentication.AppleAuthenticationButton
                      buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
                      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                      cornerRadius={theme.radii.button}
                      style={styles.appleButton}
                      onPress={() => providerPreview('Apple')}
                    />
                  ) : (
                    <AnimatedButton label="Continue with Apple" variant="apple" reduceMotion={reduceMotion} onPress={() => providerPreview('Apple')} />
                  )}
                  <AnimatedButton label="Continue with Google" variant="google" reduceMotion={reduceMotion} onPress={() => providerPreview('Google')} />
                </View>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} /><Text style={styles.dividerText}>or use your email</Text><View style={styles.dividerLine} />
                </View>
                {emailMode ? (
                  <View style={styles.form}>
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Email address</Text>
                      <TextInput
                        accessibilityLabel="Email address"
                        style={[styles.input, errors.email && styles.inputError]}
                        placeholder="you@example.com"
                        placeholderTextColor={theme.colors.muted}
                        value={email}
                        onChangeText={value => { setEmail(value); setNotice(''); setErrors(previous => ({ ...previous, email: undefined })); }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        maxLength={254}
                        returnKeyType="next"
                        onSubmitEditing={() => passwordInputRef.current?.focus()}
                      />
                      {errors.email && <Text accessibilityRole="alert" style={styles.error}>{errors.email}</Text>}
                    </View>
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Choose a password</Text>
                      <View style={[styles.passwordRow, errors.password && styles.inputError]}>
                        <TextInput
                          ref={passwordInputRef}
                          accessibilityLabel="Choose a password"
                          style={styles.passwordInput}
                          placeholder="At least 15 characters"
                          placeholderTextColor={theme.colors.muted}
                          value={password}
                          onChangeText={value => { setPassword(value); setNotice(''); setErrors(previous => ({ ...previous, password: undefined })); }}
                          secureTextEntry={!showPassword}
                          autoCapitalize="none"
                          autoCorrect={false}
                          autoComplete="new-password"
                          maxLength={128}
                          returnKeyType="done"
                          onSubmitEditing={submitPreview}
                        />
                        <Pressable accessibilityRole="button" accessibilityLabel={showPassword ? 'Hide password' : 'Show password'} accessibilityState={{ expanded: showPassword }} onPress={() => setShowPassword(value => !value)} style={styles.showPassword}>
                          <Text style={styles.showPasswordText}>{showPassword ? 'Hide' : 'Show'}</Text>
                        </Pressable>
                      </View>
                      {errors.password && <Text accessibilityRole="alert" style={styles.error}>{errors.password}</Text>}
                    </View>
                    <AnimatedButton label="Create account" reduceMotion={reduceMotion} onPress={submitPreview} />
                  </View>
                ) : (
                  <AnimatedButton label="Continue with email" pulse reduceMotion={reduceMotion} onPress={() => setEmailMode(true)} />
                )}
                {notice && <Text accessibilityLiveRegion="polite" style={styles.notice}>{notice}</Text>}
                <Text style={styles.previewNote}>No accounts are created in this preview.</Text>
              </GlassCard>
              <Pressable accessibilityRole="button" onPress={() => Alert.alert('Sign in', 'The sign-in page will follow once this signup screen is ready.')} style={styles.signIn}>
                <Text style={styles.signInText}>Already part of My Lycan? <Text style={styles.signInAction}>Sign in</Text></Text>
              </Pressable>
              <Text style={styles.footer}>Made around you.</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 10, paddingBottom: 20, justifyContent: 'center' },
  frame: { width: '100%', maxWidth: 460, alignSelf: 'center' },
  preview: { textAlign: 'center', color: theme.colors.muted, fontSize: 9, letterSpacing: 1.6, fontWeight: '600' },
  brandArea: { alignItems: 'center', paddingTop: 52, paddingBottom: 42, gap: 12 },
  compactBrand: { paddingTop: 30, paddingBottom: 28 },
  brand: { fontSize: 32, letterSpacing: 5, fontWeight: '300', color: theme.colors.ink, textAlign: 'center' },
  brandSub: { color: theme.colors.muted, fontSize: 12, lineHeight: 19, textAlign: 'center' },
  heading: { marginBottom: 9, gap: 9 },
  title: { color: theme.colors.ink, fontSize: 27, lineHeight: 34, fontWeight: '700', letterSpacing: -0.7 },
  description: { color: theme.colors.muted, fontSize: 15, lineHeight: 23 },
  actions: { gap: 12 },
  appleButton: { width: '100%', height: 56 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 5 },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.colors.line },
  dividerText: { color: theme.colors.muted, fontSize: 12 },
  form: { gap: 17 },
  fieldGroup: { gap: 7 },
  fieldLabel: { color: theme.colors.ink, fontSize: 13, fontWeight: '600' },
  input: { minHeight: 54, paddingHorizontal: 15, paddingVertical: 13, borderRadius: theme.radii.field, borderWidth: 1, borderColor: theme.colors.line, backgroundColor: 'rgba(255,255,255,0.9)', color: theme.colors.ink, fontSize: 16 },
  passwordRow: { flexDirection: 'row', alignItems: 'center', borderRadius: theme.radii.field, borderWidth: 1, borderColor: theme.colors.line, backgroundColor: 'rgba(255,255,255,0.9)' },
  passwordInput: { flex: 1, minWidth: 0, minHeight: 54, paddingHorizontal: 15, paddingVertical: 13, color: theme.colors.ink, fontSize: 16 },
  inputError: { borderColor: theme.colors.error },
  error: { color: theme.colors.error, fontSize: 12, lineHeight: 18 },
  showPassword: { minHeight: 48, minWidth: 58, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  showPasswordText: { color: theme.colors.blue, fontSize: 12, fontWeight: '600' },
  notice: { color: theme.colors.ink, backgroundColor: '#E4F0FB', borderRadius: 14, padding: 13, fontSize: 13, lineHeight: 20 },
  previewNote: { color: theme.colors.muted, fontSize: 11, lineHeight: 17, textAlign: 'center' },
  signIn: { paddingHorizontal: 5, paddingVertical: 22, minHeight: 48 },
  signInText: { textAlign: 'center', fontSize: 13, lineHeight: 21, color: theme.colors.muted },
  signInAction: { color: theme.colors.blue, fontWeight: '700' },
  footer: { marginTop: 10, textAlign: 'center', color: theme.colors.muted, fontSize: 12 },
  blueOrb: { position: 'absolute', top: '20%', right: -150, width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(169,213,250,0.22)' },
  whiteWave: { position: 'absolute', top: '12%', left: -90, width: 650, height: 290, borderRadius: 170, borderBottomWidth: 2, borderBottomColor: 'rgba(255,255,255,0.94)', backgroundColor: 'rgba(255,255,255,0.12)', transform: [{ rotate: '-26deg' }] },
  lowerWave: { position: 'absolute', bottom: -180, left: -120, width: 650, height: 420, borderRadius: 220, borderTopWidth: 2, borderTopColor: 'rgba(255,255,255,0.95)', backgroundColor: 'rgba(255,255,255,0.30)', transform: [{ rotate: '18deg' }] },
});
