// ============================================================
// ScanHistoryItem — Single row in history list
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Radii, Typography, Shadows } from '../theme/tokens';
import { ScanRecord } from '../storage/db';
import { IntentType } from '../engine/parser';

const INTENT_TYPE_META: Record<IntentType, { icon: string; label: string; color: string }> = {
  phone:   { icon: '📞', label: 'Phone Contact',   color: Colors.phoneGreen },
  upi:     { icon: '₹',  label: 'Payment UPI',     color: Colors.upiPurple },
  address: { icon: '📍', label: 'Location Pin',    color: Colors.addressBlue },
  email:   { icon: '✉️', label: 'Contact Detail',  color: Colors.emailOrange },
  url:     { icon: '🌐', label: 'Secure Link',     color: Colors.urlTeal },
};

const SOURCE_LABEL: Record<string, string> = {
  camera: 'Scanned via Camera',
  gallery: 'From Gallery',
};

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min${diffMin === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

interface ScanHistoryItemProps {
  record: ScanRecord;
  onPress: (record: ScanRecord) => void;
}

export default function ScanHistoryItem({ record, onPress }: ScanHistoryItemProps) {
  // Determine the primary intent to display
  const primaryIntent = record.intents[0];
  const meta = primaryIntent
    ? INTENT_TYPE_META[primaryIntent.type]
    : { icon: '📄', label: 'Scan', color: Colors.onSurfaceVariant };

  const displayValue = primaryIntent?.display ?? record.rawText.slice(0, 40);
  const truncated = displayValue.length > 28 ? displayValue.slice(0, 25) + '...' : displayValue;

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onPress(record)}
      activeOpacity={0.7}
    >
      {/* Icon thumbnail */}
      <View style={[styles.iconBox, { backgroundColor: Colors.surfaceContainerLow }]}>
        <Text style={styles.icon}>{meta.icon}</Text>
      </View>

      {/* Text */}
      <View style={styles.textBlock}>
        <Text style={[styles.typeLabel, { color: meta.color }]}>{meta.label.toUpperCase()}</Text>
        <Text style={styles.valueText}>{truncated}</Text>
        <Text style={styles.meta}>
          {formatRelativeTime(record.timestamp)} · {SOURCE_LABEL[record.source] ?? 'OCR Scan'}
        </Text>
      </View>

      {/* Chevron */}
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export function ScanHistoryItemSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    marginHorizontal: Spacing.lg,
    ...Shadows.card,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: {
    fontSize: 20,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  typeLabel: {
    ...Typography.labelSm,
  },
  valueText: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
  },
  meta: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
  },
  chevron: {
    fontSize: 22,
    color: Colors.onSurfaceVariant,
    lineHeight: 24,
  },
  separator: {
    height: Spacing.sm,
  },
});
