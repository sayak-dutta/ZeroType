// ============================================================
// Tab Navigator Layout — Custom tab bar with center FAB
// ============================================================
import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, Typography, Shadows } from '../../src/theme/tokens';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom || Spacing.md }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const isCenter = index === 1; // History tab is center

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        const icons: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
          camera: { active: 'camera', inactive: 'camera-outline' },
          history: { active: 'time', inactive: 'time-outline' },
          settings: { active: 'settings', inactive: 'settings-outline' },
        };
        const iconSet = icons[route.name] ?? { active: 'ellipse', inactive: 'ellipse-outline' };
        const iconName = isFocused ? iconSet.active : iconSet.inactive;
        const label = options?.title ?? route.name;

        if (isCenter) {
          return (
            <TouchableOpacity key={route.key} style={styles.centerTabContainer} onPress={onPress} activeOpacity={0.9}>
              <View style={[styles.centerFab, isFocused && styles.centerFabActive]}>
                <Ionicons name={iconName} size={22} style={styles.centerFabIcon} />
              </View>
              <Text style={[styles.centerLabel, isFocused && styles.centerLabelActive]}>{label}</Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity key={route.key} style={[styles.tabItem, isFocused && styles.tabItemActive]} onPress={onPress} activeOpacity={0.9}>
            <Ionicons name={iconName} size={18} style={[styles.tabIcon, isFocused && styles.tabIconActive]} />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="camera" options={{ title: 'Camera' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    borderTopWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.ambient,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radii.lg,
    paddingVertical: Spacing.sm,
    minHeight: 48,
    marginHorizontal: 4,
    gap: 2,
  },
  tabItemActive: {
    backgroundColor: Colors.surfaceContainerLow,
  },
  tabIcon: {
    fontSize: 16,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
    color: Colors.primary,
  },
  tabLabel: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    textTransform: 'none',
    letterSpacing: 0,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
  centerTabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -12,
    gap: 4,
  },
  centerFab: {
    width: 54,
    height: 54,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.surfaceContainerLowest,
    ...Shadows.fab,
  },
  centerFabActive: {
    backgroundColor: Colors.onPrimaryContainer,
    transform: [{ scale: 1.04 }],
  },
  centerFabIcon: {
    fontSize: 18,
    color: Colors.onPrimary,
  },
  centerLabel: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    textTransform: 'none',
    letterSpacing: 0,
  },
  centerLabelActive: {
    color: Colors.primary,
  },
});
