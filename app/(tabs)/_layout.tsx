// ============================================================
// Tab Navigator Layout — Custom tab bar with center FAB
// ============================================================
import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

        const icons: Record<string, string> = {
          camera:   '📷',
          history:  '🕐',
          settings: '⚙️',
        };
        const icon = icons[route.name] ?? '●';

        if (isCenter) {
          return (
            <TouchableOpacity key={route.key} style={styles.centerTabContainer} onPress={onPress} activeOpacity={0.8}>
              <View style={[styles.centerFab, isFocused && styles.centerFabActive]}>
                <Text style={styles.centerFabIcon}>{icon}</Text>
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity key={route.key} style={styles.tabItem} onPress={onPress} activeOpacity={0.7}>
            <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>{icon}</Text>
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
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing['3xl'],
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    ...Shadows.ambient,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  tabIcon: {
    fontSize: 24,
    opacity: 0.4,
  },
  tabIconActive: {
    opacity: 1,
  },
  centerTabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  centerFab: {
    width: 58,
    height: 58,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.surfaceContainerLowest,
    ...Shadows.fab,
  },
  centerFabActive: {
    backgroundColor: Colors.onPrimaryContainer ?? Colors.primary,
    transform: [{ scale: 1.08 }],
  },
  centerFabIcon: {
    fontSize: 24,
  },
});
