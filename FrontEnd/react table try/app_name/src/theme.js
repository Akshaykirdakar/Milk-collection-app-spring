import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  spacing: 8, // Base spacing unit
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14, // Base font size
    htmlFontSize: 16, // Browser default font size
    h1: {
      fontSize: 'clamp(1.875rem, 2.5vw, 2.5rem)',
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#1976d2',
    },
    h2: {
      fontSize: 'clamp(1.5rem, 2vw, 2rem)',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#1976d2',
    },
    h3: {
      fontSize: 'clamp(1.25rem, 1.75vw, 1.75rem)',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#1976d2',
    },
    h4: {
      fontSize: 'clamp(1.125rem, 1.5vw, 1.75rem)',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#1976d2',
    },
    h5: {
      fontSize: 'clamp(1rem, 1.25vw, 1.5rem)',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: 'clamp(0.875rem, 1vw, 1.25rem)',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: 'clamp(0.875rem, 1vw, 1rem)',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: 'clamp(0.75rem, 0.875vw, 0.875rem)',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '100%',
          margin: '0 auto',
          padding: 'clamp(0.5rem, 1vw, 1rem)',
          '@media (min-width: 600px)': {
            padding: 'clamp(1rem, 2vw, 2rem)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 'clamp(0.25rem, 0.5vw, 0.5rem)',
          padding: 'clamp(0.375rem, 0.75vw, 0.75rem) clamp(0.75rem, 1.5vw, 1.5rem)',
          fontSize: 'clamp(0.875rem, 1vw, 1rem)',
        },
        sizeSmall: {
          padding: 'clamp(0.25rem, 0.5vw, 0.5rem) clamp(0.5rem, 1vw, 1rem)',
          fontSize: 'clamp(0.75rem, 0.875vw, 0.875rem)',
        },
        sizeLarge: {
          padding: 'clamp(0.5rem, 1vw, 1rem) clamp(1rem, 2vw, 2rem)',
          fontSize: 'clamp(1rem, 1.125vw, 1.125rem)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 'clamp(0.5rem, 0.75vw, 0.75rem)',
          '&.MuiCard-root': {
            overflow: 'auto',
            maxWidth: '100%',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: 'clamp(0.5rem, 0.75vw, 0.75rem) clamp(0.75rem, 1vw, 1rem)',
          fontSize: 'clamp(0.875rem, 1vw, 1rem)',
        },
        sizeSmall: {
          padding: 'clamp(0.375rem, 0.5vw, 0.5rem) clamp(0.5rem, 0.75vw, 0.75rem)',
          fontSize: 'clamp(0.75rem, 0.875vw, 0.875rem)',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#f5f5f5',
        },
      },
    },
  },
});