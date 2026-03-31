import React from 'react';
import { Box, Paper, Typography, Container, Grid, useTheme } from '@mui/material';

export const PageContainer = ({ children, maxWidth = 'lg', sx = {} }) => (
  <Box
    sx={{
      position: 'relative',
      minHeight: '100%',
      width: '100%',
      ...sx,
    }}
  >
    <Container
      maxWidth={maxWidth}
      disableGutters
      sx={{
        position: 'relative',
        zIndex: 1,
        maxWidth: maxWidth === false ? '100% !important' : undefined,
        p: '0 !important',
      }}
    >
      <Box className="app-fade-in">{children}</Box>
    </Container>
  </Box>
);

export const PageHeader = ({ title, subtitle, action, sx = {} }) => {
  const theme = useTheme();
  return (
    <Box sx={{ mb: 4, ...sx }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 0.75,
              letterSpacing: '-0.03em',
            }}
          >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body1"
            sx={{
              color: '#6b7280',
              maxWidth: 760,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box className="no-print">{action}</Box>}
    </Box>
  </Box>
  );
};

export const SectionCard = ({
  children,
  title,
  subtitle,
  noPadding = false,
  sx = {},
  contentSx = {},
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      className="app-fade-in"
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#ffffff',
        border: `1px solid ${theme.palette.mode === 'dark' ? '#334155' : '#e6e6e6'}`,
        borderRadius: '12px',
        boxShadow: theme.palette.mode === 'dark' ? '0 8px 20px rgba(0, 0, 0, 0.25)' : '0 8px 20px rgba(15, 23, 42, 0.05)',
        color: theme.palette.text.primary,
        p: noPadding ? 0 : { xs: 2.5, sm: 3 },
        overflow: 'hidden',
        ...sx,
      }}
    >
      {(title || subtitle) && (
        <Box
          sx={{
            mb: 2.75,
            pb: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {title && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mt: 0.75,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    )}
    <Box sx={contentSx}>{children}</Box>
  </Paper>
);
};

export const FormSection = ({ children, title }) => (
  <Box sx={{ mb: 3.5 }}>
    {title && (
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 700,
          color: '#334155',
          mb: 1.75,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {title}
      </Typography>
    )}
    <Grid container spacing={2.25}>
      {children}
    </Grid>
  </Box>
);

export const FormField = ({ children, xs = 12, sm = 6, md = 4, lg = 3 }) => (
  <Grid size={{ xs, sm, md, lg }} sx={{ minWidth: 0 }}>
    {children}
  </Grid>
);

export const StatCard = ({
  label,
  value,
  color = '#2563eb',
  icon: Icon,
  tint = 'rgba(37,99,235,0.12)',
  sx = {},
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      className="app-fade-in"
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
        border: `1px solid ${theme.palette.mode === 'dark' ? '#334155' : '#e6e6e6'}`,
        color: theme.palette.text.primary,
        borderRadius: '12px',
        boxShadow: theme.palette.mode === 'dark' ? '0 8px 20px rgba(0, 0, 0, 0.22)' : '0 8px 20px rgba(15, 23, 42, 0.05)',
        p: { xs: 2.2, sm: 2.5 },
        position: 'relative',
        overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 'auto -40px -40px auto',
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${tint} 0%, rgba(255,255,255,0) 72%)`,
      },
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 18px 32px rgba(15, 23, 42, 0.1)',
      },
      ...sx,
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, position: 'relative', zIndex: 1 }}>
      <Box>
        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            fontWeight: 600,
            mb: 1.5,
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: '#0f172a',
            fontWeight: 700,
          }}
        >
          {value}
        </Typography>
      </Box>
      {Icon && (
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${tint}, rgba(255,255,255,0.9))`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.8), 0 10px 22px ${tint}`,
            flexShrink: 0,
          }}
        >
          <Icon sx={{ color, fontSize: '1.5rem' }} />
        </Box>
      )}
    </Box>
  </Paper>
);
};

export const TableHeaderCell = ({ children, ...props }) => {
  const theme = useTheme();

  return (
    <Typography
      variant="body2"
      sx={{
        fontWeight: 700,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.mode === 'dark' ? '#0f172a' : 'rgba(248,250,252,0.72)',
        padding: '12px 16px',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export const StyledTableRow = ({ children, hoverable = true, ...props }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.mode === 'dark' ? '#111827' : 'rgba(255,255,255,0.52)',
        transition: hoverable ? 'transform 0.2s ease, background-color 0.2s ease' : 'none',
        '&:hover': hoverable
          ? {
              backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : 'rgba(255,255,255,0.82)',
              transform: 'translateY(-1px)',
            }
          : {},
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export const TableCell = ({ children, flex = 1, ...props }) => (
  <Box
    sx={{
      flex,
      padding: '0 8px',
      minWidth: 0,
      ...props.sx,
    }}
    {...props}
  >
    {children}
  </Box>
);

export const EmptyState = ({ title = 'No data', subtitle = 'Nothing to show yet' }) => (
  <Box
    className="app-fade-in"
    sx={{
      textAlign: 'center',
      py: 7,
      px: 2,
      color: '#94a3b8',
    }}
  >
    <Typography
      variant="h6"
      sx={{
        fontWeight: 700,
        color: '#0f172a',
        mb: 1,
      }}
    >
      {title}
    </Typography>
    <Typography variant="body2" sx={{ color: '#6b7280' }}>
      {subtitle}
    </Typography>
  </Box>
);

export const Badge = ({ label, color = '#2563eb', variant = 'light' }) => (
  <Box
    sx={{
      display: 'inline-block',
      px: 1.6,
      py: 0.6,
      borderRadius: '999px',
      fontSize: '0.74rem',
      fontWeight: 700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      backgroundColor: variant === 'light' ? `${color}18` : color,
      color: variant === 'light' ? color : '#fff',
      border: variant === 'light' ? `1px solid ${color}30` : 'none',
      boxShadow: variant === 'light' ? `inset 0 1px 0 ${color}18` : 'none',
    }}
  >
    {label}
  </Box>
);

export const SectionDivider = ({ label, sx = {} }) => (
  <Box
    sx={{
      my: 4,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      ...sx,
    }}
  >
    <Box
      sx={{
        flex: 1,
        height: '1px',
        background: 'linear-gradient(90deg, rgba(148,163,184,0), rgba(148,163,184,0.45), rgba(148,163,184,0))',
      }}
    />
    {label && (
      <Typography
        variant="body2"
        sx={{
          color: '#64748b',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </Typography>
    )}
    {label && (
      <Box
        sx={{
          flex: 1,
          height: '1px',
          background: 'linear-gradient(90deg, rgba(148,163,184,0), rgba(148,163,184,0.45), rgba(148,163,184,0))',
        }}
      />
    )}
  </Box>
  );