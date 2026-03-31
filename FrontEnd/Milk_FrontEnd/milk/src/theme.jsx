import { alpha, createTheme } from '@mui/material/styles';

const primaryMain = '#2563eb';
const primaryLight = '#60a5fa';
const primaryDark = '#1d4ed8';
const secondaryMain = '#10b981';
const accentMain = '#f59e0b';

export function getTheme(mode = 'light') {
  const isDark = mode === 'dark';

  return createTheme({
    breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  spacing: 8,
  palette: {
    mode,
    primary: {
      main: primaryMain,
      light: primaryLight,
      dark: primaryDark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: secondaryMain,
      light: '#34d399',
      dark: '#059669',
    },
    success: {
      main: secondaryMain,
      light: '#6ee7b7',
      dark: '#059669',
    },
    warning: {
      main: accentMain,
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#06b6d4',
      light: '#67e8f9',
      dark: '#0891b2',
    },
    background: {
      default: isDark ? '#0b1220' : '#eef4fb',
      paper: isDark ? '#111827' : '#ffffff',
    },
    text: {
      primary: isDark ? '#f8fafc' : '#0f172a',
      secondary: isDark ? '#cbd5e1' : '#6b7280',
      disabled: isDark ? '#94a3b8' : '#94a3b8',
    },
    divider: isDark ? 'rgba(148, 163, 184, 0.28)' : 'rgba(148, 163, 184, 0.18)',
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: '"Segoe UI", "Manrope", "Helvetica Neue", sans-serif',
    fontSize: 14,
    htmlFontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
      fontWeight: 700,
      lineHeight: 1.05,
      letterSpacing: '-0.045em',
      color: '#0f172a',
    },
    h2: {
      fontSize: 'clamp(2rem, 3vw, 2.8rem)',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.04em',
      color: '#0f172a',
    },
    h3: {
      fontSize: 'clamp(1.7rem, 2.4vw, 2.3rem)',
      fontWeight: 700,
      lineHeight: 1.15,
      letterSpacing: '-0.035em',
      color: '#0f172a',
    },
    h4: {
      fontSize: 'clamp(1.3rem, 2vw, 1.8rem)',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.03em',
      color: '#0f172a',
    },
    h5: {
      fontSize: 'clamp(1.05rem, 1.4vw, 1.3rem)',
      fontWeight: 600,
      lineHeight: 1.35,
      color: '#0f172a',
    },
    h6: {
      fontSize: 'clamp(0.95rem, 1.1vw, 1.12rem)',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#0f172a',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
      color: '#475569',
    },
    subtitle2: {
      fontSize: '0.9rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#475569',
    },
    body1: {
      fontSize: 'clamp(0.92rem, 1vw, 1rem)',
      lineHeight: 1.7,
      color: '#334155',
    },
    body2: {
      fontSize: 'clamp(0.82rem, 0.95vw, 0.92rem)',
      lineHeight: 1.65,
      color: '#6b7280',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.92rem',
      letterSpacing: '-0.01em',
    },
    caption: {
      fontSize: '0.76rem',
      fontWeight: 500,
      color: '#94a3b8',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          colorScheme: mode,
        },
        'html, body, #root': {
          minHeight: '100%',
          background: isDark ? 'linear-gradient(135deg, #070a16 0%, #111827 50%, #1e293b 100%)' : 'linear-gradient(135deg, #f5f7fa 0%, #e4ecf7 45%, #edf5ff 100%)',
          color: isDark ? '#f8fafc' : '#0f172a',
          overflow: 'hidden',
        },
        body: {
          margin: 0,
          backgroundAttachment: 'fixed',
          overflow: 'hidden',
        },
        '@keyframes fadeSlideUp': {
          '0%': {
            opacity: 0,
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        '@keyframes glowFloat': {
          '0%, 100%': {
            transform: 'translate3d(0, 0, 0) scale(1)',
          },
          '50%': {
            transform: 'translate3d(0, -10px, 0) scale(1.04)',
          },
        },
        '.app-fade-in': {
          animation: 'fadeSlideUp 0.55s ease both',
        },
        '.no-print': {
          '@media print': {
            display: 'none !important',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '100%',
          margin: '0 auto',
          padding: 'clamp(1rem, 2vw, 2rem)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          paddingInline: 18,
          transition: 'transform 0.2s ease, box-shadow 0.25s ease, border-color 0.2s ease',
          boxShadow: 'none',
          paddingInline: 18,
          '&:hover': {
            transform: 'translateY(-1px) scale(1.01)',
            boxShadow: '0 12px 26px rgba(37, 99, 235, 0.14)',
          },
        },
        contained: {
          color: '#ffffff',
          background: `linear-gradient(135deg, ${primaryMain}, ${primaryLight})`,
          boxShadow: '0 10px 24px rgba(37, 99, 235, 0.18)',
          '&:hover': {
            background: `linear-gradient(135deg, ${primaryDark}, ${primaryMain})`,
          },
        },
        outlined: {
          backgroundColor: '#ffffff',
          borderColor: '#e6e6e6',
          '&:hover': {
            borderColor: alpha(primaryMain, 0.4),
            backgroundColor: '#ffffff',
            boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: isDark ? '#111827' : '#ffffff',
          border: isDark ? '1px solid #334155' : '1px solid #e6e6e6',
          boxShadow: isDark
            ? '0 8px 20px rgba(0, 0, 0, 0.25)'
            : '0 8px 20px rgba(15, 23, 42, 0.05)',
          color: isDark ? '#e2e8f0' : '#0f172a',
          transition: 'transform 0.2s ease, box-shadow 0.25s ease, border-color 0.2s ease',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          border: isDark ? '1px solid #334155' : '1px solid #e6e6e6',
          color: isDark ? '#e2e8f0' : '#0f172a',
          boxShadow: isDark
            ? '0 8px 20px rgba(0, 0, 0, 0.22)'
            : '0 8px 20px rgba(15, 23, 42, 0.05)',
          borderRadius: 12,
          transition: 'transform 0.2s ease, box-shadow 0.25s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderRadius: 12,
            transition: 'box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
            '& fieldset': {
              borderColor: isDark ? '#374151' : '#e6e6e6',
            },
            '&:hover': {
              backgroundColor: isDark ? '#2d3748' : '#ffffff',
            },
            '&:hover fieldset': {
              borderColor: isDark ? '#4b5563' : alpha(primaryMain, 0.3),
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 4px ${alpha(primaryMain, isDark ? 0.15 : 0.12)}`,
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
            },
            '&.Mui-focused fieldset': {
              borderColor: primaryMain,
              borderWidth: '1px',
            },
          },
          '& .MuiOutlinedInput-input': {
            fontSize: '0.9rem',
            padding: '12px 14px',
            color: isDark ? '#e2e8f0' : '#0f172a',
            '&::placeholder': {
              color: isDark ? '#9ca3af' : '#9ca3af',
              opacity: isDark ? 0.7 : 1,
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.88rem',
          fontWeight: 600,
          color: isDark ? '#cbd5e1' : '#475569',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          color: isDark ? '#e2e8f0' : '#0f172a',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            '& fieldset': {
              borderColor: isDark ? '#374151' : '#e6e6e6',
            },
            '&:hover fieldset': {
              borderColor: isDark ? '#4b5563' : alpha(primaryMain, 0.3),
            },
            '&.Mui-focused fieldset': {
              borderColor: primaryMain,
            },
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.9rem',
          borderRadius: 10,
          margin: '2px 6px',
          '&:hover': {
            backgroundColor: alpha(primaryMain, 0.08),
          },
          '&.Mui-selected': {
            backgroundColor: alpha(primaryMain, 0.12),
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(226, 232, 240, 0.8)',
          padding: '14px 16px',
          fontSize: '0.88rem',
        },
        head: {
          fontWeight: 700,
          backgroundColor: 'rgba(248, 250, 252, 0.72)',
          color: '#334155',
          fontSize: '0.78rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease, transform 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.75)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: '1px solid #e6e6e6',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 999,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          color: isDark ? '#e2e8f0' : '#0f172a',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          color: isDark ? '#e2e8f0' : '#0f172a',
          borderColor: isDark ? '#334155' : '#e6e6e6',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: isDark ? '#cbd5e1' : '#334155',
          '&.Mui-selected': {
            backgroundColor: isDark ? 'rgba(59,130,246,0.24)' : 'rgba(37,99,235,0.08)',
            color: isDark ? '#93c5fd' : '#2563eb',
          },
          '&:hover': {
            backgroundColor: isDark ? 'rgba(148,163,184,0.24)' : '#f8fafc',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      },
    },
  },
});
}

