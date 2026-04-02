// ============================================================
// useBiometrics — Local Authentication Hook
// ============================================================
import { useState, useCallback, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export interface BiometricState {
  isSupported: boolean;
  isEnrolled: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  biometricType: 'fingerprint' | 'faceid' | 'iris' | 'none';
}

export function useBiometrics() {
  const [state, setState] = useState<BiometricState>({
    isSupported: false,
    isEnrolled: false,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    biometricType: 'none',
  });

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      let biometricType: BiometricState['biometricType'] = 'none';
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        biometricType = 'faceid';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        biometricType = 'fingerprint';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        biometricType = 'iris';
      }

      setState((s) => ({ ...s, isSupported: compatible, isEnrolled: enrolled, biometricType, isLoading: false }));
    })();
  }, []);

  const authenticate = useCallback(async (): Promise<boolean> => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verify your identity to access Scan History',
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
        requireConfirmation: false,
      });

      if (result.success) {
        setState((s) => ({ ...s, isAuthenticated: true, isLoading: false }));
        return true;
      } else {
        const errMsg = result.error === 'user_cancel' ? 'Authentication cancelled.' : 'Authentication failed.';
        setState((s) => ({ ...s, isAuthenticated: false, isLoading: false, error: errMsg }));
        return false;
      }
    } catch (e: any) {
      setState((s) => ({ ...s, isLoading: false, error: e?.message ?? 'Authentication error.' }));
      return false;
    }
  }, []);

  const lock = useCallback(() => {
    setState((s) => ({ ...s, isAuthenticated: false }));
  }, []);

  return { ...state, authenticate, lock };
}
