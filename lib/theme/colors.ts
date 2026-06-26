export const themeColors = {
  light: {
    // Background colors
    bg: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      tertiary: '#f0f1f3',
      hover: '#e9ecef',
    },
    // Text colors
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
      tertiary: '#999999',
      muted: '#cccccc',
    },
    // Border colors
    border: {
      primary: '#e0e0e0',
      secondary: '#d0d0d0',
    },
    // Component colors
    navbar: '#ffffff',
    navbarBorder: '#e0e0e0',
    card: '#ffffff',
    cardBorder: '#e0e0e0',
    // Accent colors
    accent: '#7c3aed',
    accentLight: '#ede9fe',
    accentDark: '#6d28d9',
  },
  dark: {
    // Background colors
    bg: {
      primary: '#0a0a0a',
      secondary: '#0d0d0d',
      tertiary: '#141414',
      hover: '#1a1a1a',
    },
    // Text colors
    text: {
      primary: '#f0f0f0',
      secondary: '#888888',
      tertiary: '#555555',
      muted: '#333333',
    },
    // Border colors
    border: {
      primary: '#2a2a2a',
      secondary: '#1e1e1e',
    },
    // Component colors
    navbar: '#0d0d0d',
    navbarBorder: '#1e1e1e',
    card: '#0d0d0d',
    cardBorder: '#2a2a2a',
    // Accent colors
    accent: '#7c3aed',
    accentLight: '#a78bfa',
    accentDark: '#6d28d9',
  },
};

export type ThemeColors = typeof themeColors.light;
