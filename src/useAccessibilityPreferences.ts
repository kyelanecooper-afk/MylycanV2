import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

export function useAccessibilityPreferences() {
  // Start without animation/transparency until the device preference is known.
  const [reduceMotion, setReduceMotion] = useState(true);
  const [reduceTransparency, setReduceTransparency] = useState(true);

  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (active) setReduceMotion(value);
    }).catch(() => {});
    if (Platform.OS === 'ios') {
      void AccessibilityInfo.isReduceTransparencyEnabled().then(value => {
        if (active) setReduceTransparency(value);
      }).catch(() => {});
    } else {
      setReduceTransparency(false);
    }
    const motion = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    const transparency = Platform.OS === 'ios'
      ? AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduceTransparency)
      : null;
    return () => {
      active = false;
      motion.remove();
      transparency?.remove();
    };
  }, []);

  return { reduceMotion, reduceTransparency };
}
