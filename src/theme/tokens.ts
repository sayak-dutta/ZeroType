// ============================================================
// Design Tokens — "Ethereal Utility / Arctic" System
// Based on DESIGN.md specifications
// ============================================================

export const Colors = {
  // Surface Hierarchy (tonal layering — no borders)
  surface: '#F5F7FA',              // Base canvas
  surfaceContainerLow: '#EEF1F4', // Secondary sections
  surfaceContainerLowest: '#FFFFFF', // Primary cards (elevated)
  surfaceContainerHigh: '#E5E9EE', // Pressed/hover states
  surfaceContainer: '#E9ECF1',

  // Primary — "Sky Blue" Arctic accent
  primary: '#0058BA',
  primaryContainer: '#6C9FFF',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#001D4A',

  // Text
  onSurface: '#2C2F32',          // Never pure black
  onSurfaceVariant: '#6B7280',   // Secondary text, soft contrast
  onSurfaceDisabled: '#A0A7B0',

  // Utility
  outlineVariant: 'rgba(44, 47, 50, 0.15)', // Ghost border
  outline: 'rgba(44, 47, 50, 0.30)',
  scrim: 'rgba(0, 0, 0, 0.40)',

  // Semantic intent colors
  phoneGreen: '#059669',
  phoneGreenContainer: '#D1FAE5',
  upiPurple: '#7C3AED',
  upiPurpleContainer: '#EDE9FE',
  addressBlue: '#0058BA',
  addressBlueContainer: '#DBEAFE',
  emailOrange: '#D97706',
  emailOrangeContainer: '#FEF3C7',
  urlTeal: '#0891B2',
  urlTealContainer: '#E0F2FE',

  // Glassmorphism tints
  glassSurface: 'rgba(245, 247, 250, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.60)',
  primaryGlow: 'rgba(0, 88, 186, 0.15)',
};

export const Gradients = {
  // Primary gradient — 135° as per DESIGN.md
  primary: ['#0058BA', '#6C9FFF'] as string[],
  primaryAngle: 135,

  // Surface gradient for subtle depth
  surface: ['#F5F7FA', '#EEF1F4'] as string[],

  // FAB glow (ambient shadow tint)
  fabGlow: 'rgba(0, 88, 186, 0.25)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

export const Radii = {
  sm: 8,     // Minor elements
  md: 12,    // Minimum allowed per DESIGN.md
  lg: 16,
  xl: 24,    // Main containers, bottom sheets (top only)
  '2xl': 32,
  full: 9999, // Pills, FABs
};

export const Typography = {
  // Display — for scan results, hero numbers
  displayLg: {
    fontFamily: 'Inter_700Bold',
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.72, // -0.02em
  },
  displayMd: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.56,
  },
  displaySm: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.44,
  },

  // Headline
  headlineLg: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  headlineMd: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: -0.36,
  },

  // Body
  bodyLg: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyMd: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  bodySm: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
  },

  // Labels — editorial "eyebrow" style (ALL CAPS + tracking)
  labelLg: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6, // +0.05em
    textTransform: 'uppercase' as const,
  },
  labelMd: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.55,
    textTransform: 'uppercase' as const,
  },
  labelSm: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
};

export const Shadows = {
  // Ambient shadow — large blur, low opacity, tinted (never pure black)
  ambient: {
    shadowColor: Colors.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  card: {
    shadowColor: Colors.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  fab: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30,
    shadowRadius: 32,
    elevation: 12,
  },
};

export const Animation = {
  fast: 150,
  normal: 250,
  slow: 350,
  spring: {
    damping: 18,
    stiffness: 200,
    mass: 0.8,
  },
};
