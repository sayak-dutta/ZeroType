// ============================================================
// Settings Screen
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Switch, TouchableOpacity,
  ScrollView, Alert, Platform,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, Radii, Typography, Shadows } from '../../src/theme/tokens';
import { clearAllScans } from '../../src/storage/db';
import * as Haptics from 'expo-haptics';
import { useBiometrics } from '../../src/hooks/useBiometrics';

interface SettingRowProps {
  icon: string;
  label: string;
  description?: string;
  value?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  destructive?: boolean;
  showChevron?: boolean;
}

function SettingRow({ icon, label, description, value, onToggle, onPress, destructive = false, showChevron = false }: SettingRowProps) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress && onToggle === undefined}
      activeOpacity={0.7}
    >
      <View style={styles.settingRowLeft}>
        <View style={[styles.settingIcon, destructive && styles.settingIconDestructive]}>
          <Text style={styles.settingIconText}>{icon}</Text>
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingLabel, destructive && { color: '#DC2626' }]}>{label}</Text>
          {description && <Text style={styles.settingDesc}>{description}</Text>}
        </View>
      </View>
      {onToggle !== undefined && value !== undefined && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: Colors.surfaceContainerHigh, true: Colors.primaryContainer }}
          thumbColor={value ? Colors.primary : Colors.onSurfaceDisabled}
          ios_backgroundColor={Colors.surfaceContainerHigh}
        />
      )}
      {showChevron && <Text style={styles.chevron}>›</Text>}
    </TouchableOpacity>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [requireBiometrics, setRequireBiometrics] = useState(true);
  const { isSupported, biometricType } = useBiometrics();

  const biometricLabel = biometricType === 'faceid'
    ? 'Face ID'
    : biometricType === 'fingerprint'
    ? 'Fingerprint'
    : 'Biometrics';

  const handleClearHistory = () => {
    Alert.alert(
      'Clear All History',
      'This will permanently delete all scan records from your device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All', style: 'destructive', onPress: async () => {
            await clearAllScans();
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Done', 'All scan history has been cleared.');
          }
        },
      ]
    );
  };

  const handleHapticsToggle = async (v: boolean) => {
    setHapticsEnabled(v);
    if (v) await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>PREFERENCES</Text>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Privacy */}
      <Animated.View entering={FadeInDown.delay(60)}>
        <SectionCard title="PRIVACY & SECURITY">
          <SettingRow
            icon="🔒"
            label={`Require ${biometricLabel} for History`}
            description={isSupported ? `Lock History Vault behind ${biometricLabel}` : 'No biometric hardware detected'}
            value={requireBiometrics && isSupported}
            onToggle={isSupported ? setRequireBiometrics : undefined}
          />
        </SectionCard>
      </Animated.View>

      {/* Experience */}
      <Animated.View entering={FadeInDown.delay(120)}>
        <SectionCard title="EXPERIENCE">
          <SettingRow
            icon="📳"
            label="Haptic Feedback"
            description="Vibrate when intents are detected"
            value={hapticsEnabled}
            onToggle={handleHapticsToggle}
          />
        </SectionCard>
      </Animated.View>

      {/* Data */}
      <Animated.View entering={FadeInDown.delay(180)}>
        <SectionCard title="DATA">
          <SettingRow
            icon="🗑"
            label="Clear Scan History"
            description="Permanently delete all scan records"
            onPress={handleClearHistory}
            destructive
          />
        </SectionCard>
      </Animated.View>

      {/* About */}
      <Animated.View entering={FadeInDown.delay(240)}>
        <SectionCard title="ABOUT">
          <View style={styles.aboutBlock}>
            <Text style={styles.appName}>ScanIntent</Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            <View style={styles.privacyBadge}>
              <Text style={styles.privacyIcon}>🛡</Text>
              <Text style={styles.privacyText}>100% On-Device · No Cloud · No Tracking</Text>
            </View>
            <Text style={styles.aboutDetail}>
              All OCR processing, data extraction, and storage happens locally on your device. 
              No data ever leaves your phone.
            </Text>
          </View>
        </SectionCard>
      </Animated.View>

      <View style={{ height: Spacing['5xl'] }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    paddingBottom: Spacing['4xl'],
  },
  header: {
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing.xl,
  },
  eyebrow: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    marginBottom: 4,
  },
  title: {
    ...Typography.displaySm,
    color: Colors.onSurface,
  },
  section: {
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    marginLeft: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    ...Shadows.card,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 0,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIconDestructive: {
    backgroundColor: '#FEE2E2',
  },
  settingIconText: {
    fontSize: 18,
  },
  settingText: {
    flex: 1,
    gap: 2,
  },
  settingLabel: {
    ...Typography.bodyLg,
    color: Colors.onSurface,
    fontFamily: 'Inter_500Medium',
  },
  settingDesc: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
  },
  chevron: {
    fontSize: 22,
    color: Colors.onSurfaceVariant,
  },
  aboutBlock: {
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  appName: {
    ...Typography.headlineLg,
    color: Colors.primary,
  },
  aboutVersion: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    marginTop: Spacing.sm,
  },
  privacyIcon: { fontSize: 14 },
  privacyText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    textTransform: 'none',
    letterSpacing: 0,
  },
  aboutDetail: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: Spacing.sm,
  },
});
