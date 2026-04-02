// ============================================================
// IntentCard — Displays a single detected intent with actions
// ============================================================
import React, { useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, Alert,
} from 'react-native';
import * as Linking from 'expo-linking';
import * as Contacts from 'expo-contacts';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Radii, Typography, Shadows } from '../theme/tokens';
import { Intent } from '../engine/parser';

// Icons as Unicode/SVG-like characters (replace with a real icon lib in production)
const ICONS: Record<string, string> = {
  phone: '📞',
  whatsapp: '💬',
  save: '👤',
  navigate: '🧭',
  copy: '📋',
  pay: '💳',
  email: '✉️',
  open: '🔗',
  upi: '₹',
  address: '📍',
  url: '🌐',
};

const INTENT_META: Record<
  Intent['type'],
  { label: string; icon: string; color: string; bgColor: string }
> = {
  phone: { label: 'PHONE NUMBER', icon: '📞', color: Colors.phoneGreen, bgColor: Colors.phoneGreenContainer },
  upi:   { label: 'UPI ID',       icon: '₹',  color: Colors.upiPurple, bgColor: Colors.upiPurpleContainer },
  address: { label: 'ADDRESS DETECTED', icon: '📍', color: Colors.addressBlue, bgColor: Colors.addressBlueContainer },
  email: { label: 'EMAIL ADDRESS', icon: '✉️', color: Colors.emailOrange, bgColor: Colors.emailOrangeContainer },
  url:   { label: 'WEB LINK',      icon: '🌐', color: Colors.urlTeal,   bgColor: Colors.urlTealContainer },
};

interface ActionButtonProps {
  label: string;
  icon: string;
  onPress: () => void;
  primary?: boolean;
  color?: string;
}

function ActionButton({ label, icon, onPress, primary = false, color }: ActionButtonProps) {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  return (
    <TouchableOpacity
      style={[
        styles.actionBtn,
        primary && styles.actionBtnPrimary,
        primary && color ? { backgroundColor: color } : {},
      ]}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      <Text style={styles.actionBtnIcon}>{icon}</Text>
      <Text style={[styles.actionBtnLabel, primary && styles.actionBtnLabelPrimary]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface IntentCardProps {
  intent: Intent;
}

export default function IntentCard({ intent }: IntentCardProps) {
  const meta = INTENT_META[intent.type];

  const openPhone = useCallback(() => {
    Linking.openURL(`tel:${intent.value.replace(/\s/g, '')}`);
  }, [intent.value]);

  const openWhatsApp = useCallback(() => {
    const number = intent.value.replace(/[^0-9]/g, '');
    Linking.openURL(`https://wa.me/${number}`).catch(() => {
      Alert.alert('WhatsApp not found', 'Please install WhatsApp to use this feature.');
    });
  }, [intent.value]);

  const saveContact = useCallback(async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Contacts permission is required to save this contact.');
      return;
    }
    const number = intent.value.replace(/\s/g, '');
    await Contacts.addContactAsync({
      name: 'Scanned Contact',
      phoneNumbers: [{ number, label: 'mobile' }],
    });
    Alert.alert('Saved!', 'Contact has been added to your phone.');
  }, [intent.value]);

  const openMaps = useCallback(() => {
    const query = encodeURIComponent(intent.value);
    const url = Platform.OS === 'ios'
      ? `maps:?q=${query}`
      : `geo:0,0?q=${query}`;
    Linking.openURL(url).catch(() => {
      // Fallback to Google Maps web
      Linking.openURL(`https://maps.google.com/?q=${query}`);
    });
  }, [intent.value]);

  const copyToClipboard = useCallback(async () => {
    const Clipboard = await import('expo-clipboard');
    await Clipboard.setStringAsync(intent.value);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [intent.value]);

  const openUpi = useCallback(() => {
    const url = `upi://pay?pa=${intent.value}&pn=ScanIntent&cu=INR`;
    Linking.openURL(url).catch(() => {
      Alert.alert('UPI App not found', 'Please install a UPI payment app.');
    });
  }, [intent.value]);

  const openEmail = useCallback(() => {
    Linking.openURL(`mailto:${intent.value}`);
  }, [intent.value]);

  const openUrl = useCallback(() => {
    Linking.openURL(intent.value).catch(() => {
      Alert.alert('Cannot open URL', intent.value);
    });
  }, [intent.value]);

  const renderActions = () => {
    switch (intent.type) {
      case 'phone':
        return (
          <View style={styles.actionsRow}>
            <ActionButton label="CALL" icon={ICONS.phone} onPress={openPhone} primary color={Colors.phoneGreen} />
            <ActionButton label="WHATSAPP" icon={ICONS.whatsapp} onPress={openWhatsApp} />
            <ActionButton label="SAVE" icon={ICONS.save} onPress={saveContact} />
          </View>
        );
      case 'upi':
        return (
          <View style={styles.actionsRow}>
            <ActionButton label="PAY NOW" icon={ICONS.upi} onPress={openUpi} primary color={Colors.upiPurple} />
            <ActionButton label="COPY" icon={ICONS.copy} onPress={copyToClipboard} />
          </View>
        );
      case 'address':
        return (
          <View style={styles.actionsRow}>
            <ActionButton label="NAVIGATE" icon={ICONS.navigate} onPress={openMaps} primary color={Colors.primary} />
            <ActionButton label="COPY" icon={ICONS.copy} onPress={copyToClipboard} />
          </View>
        );
      case 'email':
        return (
          <View style={styles.actionsRow}>
            <ActionButton label="COMPOSE" icon={ICONS.email} onPress={openEmail} primary color={Colors.emailOrange} />
            <ActionButton label="COPY" icon={ICONS.copy} onPress={copyToClipboard} />
          </View>
        );
      case 'url':
        return (
          <View style={styles.actionsRow}>
            <ActionButton label="OPEN" icon={ICONS.open} onPress={openUrl} primary color={Colors.urlTeal} />
            <ActionButton label="COPY" icon={ICONS.copy} onPress={copyToClipboard} />
          </View>
        );
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBubble, { backgroundColor: meta.bgColor }]}>
          <Text style={[styles.iconText, { color: meta.color }]}>{meta.icon}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.intentLabel, { color: meta.color }]}>{meta.label}</Text>
          <Text style={styles.intentValue} numberOfLines={2}>{intent.display}</Text>
        </View>
      </View>
      {renderActions()}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconText: {
    fontSize: 20,
  },
  headerText: {
    flex: 1,
  },
  intentLabel: {
    ...Typography.labelMd,
    marginBottom: 2,
  },
  intentValue: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainerLow,
    flex: 1,
    minWidth: 90,
    justifyContent: 'center',
  },
  actionBtnPrimary: {
    backgroundColor: Colors.primary,
    flexGrow: 2,
  },
  actionBtnIcon: {
    fontSize: 14,
  },
  actionBtnLabel: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  actionBtnLabelPrimary: {
    color: Colors.onPrimary,
  },
});
