export const academicTheme = {
  colors: {
    primary: '#0B1D3A',
    primaryAlt: '#102A43',
    night: '#071426',
    bronze: '#B08D57',
    bronzeLight: '#C49A5A',
    parchment: '#F4EBD8',
    card: '#FFF9EC',
    cardSoft: '#FBF1DE',
    border: '#D7C49A',
    textDark: '#142236',
    textMuted: '#6E6253',
    textLight: '#FFF9EC',
    shadow: '#031020',
  },
  radii: {
    hero: 18,
    card: 14,
    dock: 18,
    pill: 999,
  },
  spacing: {
    screen: 20,
    section: 24,
  },
};

export const homeColors = {
  primary: academicTheme.colors.primary,
  primaryDark: academicTheme.colors.night,
  primaryDeeper: academicTheme.colors.night,
  primarySoft: academicTheme.colors.parchment,
  background: academicTheme.colors.night,
  surface: academicTheme.colors.card,
  glass: 'rgba(255, 249, 236, 0.94)',
  border: academicTheme.colors.border,
  divider: 'rgba(176, 141, 87, 0.28)',
  text: academicTheme.colors.textDark,
  muted: academicTheme.colors.textMuted,
  softText: '#897B67',
  shadow: academicTheme.colors.shadow,
  dark: academicTheme.colors.primary,
};

export const homeRadii = {
  hero: academicTheme.radii.hero,
  glass: 16,
  service: 14,
  dock: academicTheme.radii.dock,
  pill: 12,
};
