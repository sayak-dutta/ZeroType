// ============================================================
// ActionDrawer — @gorhom/bottom-sheet post-scan results
// Glassmorphism design with intent cards
// ============================================================
import React, { useCallback, useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, Radii, Typography, Shadows } from '../theme/tokens';
import IntentCard from './IntentCard';
import { Intent } from '../engine/parser';

interface ActionDrawerProps {
  intents: Intent[];
  visible: boolean;
  onClose: () => void;
  onSaveAll?: () => void;
}

export default function ActionDrawer({ intents, visible, onClose, onSaveAll }: ActionDrawerProps) {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['55%', '88%'], []);

  useEffect(() => {
    if (visible && intents.length > 0) {
      sheetRef.current?.snapToIndex(0);
    } else if (!visible) {
      sheetRef.current?.close();
    }
  }, [visible, intents.length]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.4}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleClose = useCallback(() => {
    sheetRef.current?.close();
    onClose();
  }, [onClose]);

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={(index) => { if (index === -1) onClose(); }}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.sheetBackground}
      style={styles.sheet}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.drawerHeader}>
          <View>
            <Text style={styles.eyebrow}>INTENT DETECTED</Text>
            <Text style={styles.title}>Post-Capture Results</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Count Badge */}
        {intents.length > 0 && (
          <Animated.View entering={FadeIn.delay(100)} style={styles.countBadge}>
            <Text style={styles.countBadgeText}>
              {intents.length} {intents.length === 1 ? 'item' : 'items'} found
            </Text>
          </Animated.View>
        )}

        {/* Intent Cards */}
        {intents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No data detected</Text>
            <Text style={styles.emptySubtitle}>
              Try capturing a clearer image with better lighting.
            </Text>
          </View>
        ) : (
          intents.map((intent, i) => (
            <Animated.View
              key={intent.id}
              entering={FadeInDown.delay(i * 80).springify()}
            >
              <IntentCard intent={intent} />
            </Animated.View>
          ))
        )}

        {/* Save All Button */}
        {intents.length > 0 && onSaveAll && (
          <Animated.View entering={FadeInDown.delay(intents.length * 80 + 100)}>
            <TouchableOpacity style={styles.saveAllBtn} onPress={onSaveAll} activeOpacity={0.8}>
              <Text style={styles.saveAllBtnText}>💾  Save Scan to History</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={{ height: Spacing['3xl'] }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    ...Shadows.ambient,
  },
  sheetBackground: {
    backgroundColor: Colors.surface,
    // 10% primary tint for brand luminescence per DESIGN.md
    opacity: 0.97,
  },
  handle: {
    backgroundColor: Colors.outlineVariant,
    width: 36,
    height: 4,
    borderRadius: Radii.full,
  },
  content: {
    padding: Spacing['2xl'],
    paddingTop: Spacing.lg,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  eyebrow: {
    ...Typography.labelMd,
    color: Colors.primary,
    marginBottom: 4,
  },
  title: {
    ...Typography.displaySm,
    color: Colors.onSurface,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  countBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radii.full,
    marginBottom: Spacing.lg,
  },
  countBadgeText: {
    ...Typography.labelSm,
    color: Colors.primary,
    textTransform: 'none',
    letterSpacing: 0,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
    gap: Spacing.sm,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
  },
  emptySubtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  saveAllBtn: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.xl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  saveAllBtnText: {
    ...Typography.bodyLg,
    color: Colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
});
