import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Button, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_URLS } from './config/api';
import {
  PageContainer,
  SectionCard,
} from './components/UIComponents';
import {
  People as PeopleIcon,
  LocalDrink as MilkIcon,
  Assessment as ReportIcon,
  TrendingUp as TrendingIcon,
  AddCircleOutline as AddMilkEntryIcon,
  GroupOutlined as SuppliersIcon,
  DescriptionOutlined as ReportsIcon,
  TuneOutlined as PricingIcon,
  WaterDrop as DropIcon,
} from '@mui/icons-material';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalSuppliers: 0,
    totalEntries: 0,
    totalMilk: 0,
    todayEntries: 0,
  });
  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      // Fetch suppliers count
      const suppliersRes = await axios.get(API_URLS.getUser);
      const suppliersCount = suppliersRes.data?.length || 0;

      // Only query milk entries when a read endpoint is configured.
      const entries = API_URLS.getMilkEntries
        ? (await axios.get(API_URLS.getMilkEntries)).data || []
        : [];
      const totalEntries = entries.length;
      const totalMilk = entries.reduce((sum, entry) => sum + (parseFloat(entry.liters) || 0), 0);

      // Calculate today's entries
      const today = new Date().toISOString().split('T')[0];
      const todayEntries = entries.filter((entry) => entry.date === today).length;

      setStats({
        totalSuppliers: suppliersCount,
        totalEntries,
        totalMilk: totalMilk.toFixed(2),
        todayEntries,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <PageContainer maxWidth={false}>
      <Box
        sx={{
          width: '100%',
          px: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Grid container spacing={3} alignItems="stretch">
          <Grid size={{ xs: 12, lg: 6.8 }}>
            <SectionCard
              noPadding
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                minHeight: 240,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #0d1f48 0%, #081428 100%)'
                  : 'linear-gradient(135deg, #1d9bf0 0%, #2563eb 100%)',
                borderColor: theme.palette.mode === 'dark' ? '#1e40af' : '#2596ec',
                color: '#ffffff',
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1.2fr 0.8fr' },
                  gap: 2,
                  height: '100%',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255,255,255,0.88)', fontWeight: 600, mb: 1 }}
                  >
                    {t('dashboard') || 'Dashboard'}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      color: '#ffffff',
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    {t('welcomeToMilkCollection') || 'Welcome to Milk Collection'}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255,255,255,0.82)', maxWidth: 340, mb: 3 }}
                  >
                    Check all key collection statistics and move through daily operations from one place.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: '1.8rem' }}>
                        {stats.totalSuppliers}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {t('totalSuppliers') || 'Total Suppliers'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: '1.8rem' }}>
                        {stats.totalEntries}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {t('totalEntries') || 'Total Entries'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: { xs: 'flex-start', sm: 'center' },
                    alignItems: 'center',
                    minHeight: 160,
                  }}
                >
                  <Box
                    sx={{
                      width: 164,
                      height: 164,
                      borderRadius: '32px',
                      background: 'rgba(255,255,255,0.16)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28)',
                    }}
                  >
                    <DropIcon sx={{ fontSize: 74, color: '#ffffff' }} />
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: { xs: 'auto', sm: 16 },
                      width: 54,
                      height: 54,
                      borderRadius: '18px',
                      background: 'rgba(255,255,255,0.18)',
                    }}
                  />
                </Box>
              </Box>
            </SectionCard>
          </Grid>

          <Grid size={{ xs: 12, lg: 5.2 }}>
            <Grid container spacing={2.5}>
              {[
            {
              label: t('totalSuppliers') || 'Total Suppliers',
              value: stats.totalSuppliers,
              icon: PeopleIcon,
              accent: '#ec4899',
              tint: 'rgba(244, 114, 182, 0.16)',
            },
            {
              label: t('totalEntries') || 'Total Entries',
              value: stats.totalEntries,
              icon: MilkIcon,
              accent: '#8b5cf6',
              tint: 'rgba(139, 92, 246, 0.16)',
            },
            {
              label: t('totalMilk') || 'Total Milk Collected',
              value: stats.totalMilk,
              icon: TrendingIcon,
              accent: '#14b8a6',
              tint: 'rgba(20, 184, 166, 0.16)',
            },
            {
              label: t('todayEntries') || "Today's Entries",
              value: stats.todayEntries,
              icon: ReportIcon,
              accent: '#f59e0b',
              tint: 'rgba(245, 158, 11, 0.14)',
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Grid key={item.label} size={{ xs: 12, sm: 6 }}>
                <SectionCard
                  noPadding
                  sx={{
                    p: 2.5,
                    minHeight: 112,
                    borderRadius: '12px',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.35 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: 600,
                          fontSize: '0.88rem',
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        sx={{
                          color: theme.palette.text.primary,
                          fontWeight: 700,
                          fontSize: { xs: '1.8rem', sm: '2rem' },
                          lineHeight: 1.1,
                          letterSpacing: '-0.03em',
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: '12px',
                        background: theme.palette.mode === 'dark'
                          ? `linear-gradient(135deg, ${item.tint}, rgba(30,41,59,0.92))`
                          : `linear-gradient(135deg, ${item.tint}, rgba(255,255,255,0.92))`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: theme.palette.mode === 'dark'
                          ? `inset 0 1px 0 rgba(255,255,255,0.1), 0 12px 24px ${item.tint}`
                          : `inset 0 1px 0 rgba(255,255,255,0.9), 0 12px 24px ${item.tint}`,
                      }}
                      >
                      <Icon sx={{ color: item.accent, fontSize: '1.35rem' }} />
                    </Box>
                  </Box>
                </SectionCard>
              </Grid>
            );
          })}
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 7.5 }}>
            <SectionCard
              title={t('operationsOverview')}
              subtitle="A quick snapshot of collection activity across the system."
            >
              <Box
                sx={{
                  height: 280,
                  borderRadius: '12px',
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(180deg, rgba(37,99,235,0.08), rgba(59,130,246,0.04))'
                    : 'linear-gradient(180deg, rgba(37,99,235,0.04), rgba(255,255,255,0.6))',
                  border: theme.palette.mode === 'dark' ? '1px solid #334155' : '1px solid #eef2f7',
                  p: 2.5,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                    gap: 2,
                  }}
                >
                  {[
                    { label: t('chartSuppliers'), value: stats.totalSuppliers, color: '#2563eb' },
                    { label: t('chartEntries'), value: stats.totalEntries, color: '#10b981' },
                    { label: t('chartMilk'), value: stats.totalMilk, color: '#f59e0b' },
                    { label: t('todayEntries'), value: stats.todayEntries, color: '#06b6d4' },
                  ].map((metric) => (
                    <Box key={metric.label}>
                      <Typography sx={{ fontWeight: 700, color: metric.color, fontSize: '1.25rem' }}>
                        {metric.value}
                      </Typography>
                      <Typography variant="caption">{metric.label}</Typography>
                    </Box>
                  ))}
                </Box>

                <Box
                  sx={{
                    position: 'relative',
                    height: 150,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    background:
                      'linear-gradient(180deg, rgba(37,99,235,0.05), rgba(255,255,255,0.24))',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: theme.palette.mode === 'dark'
                        ? 'linear-gradient(to right, rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(to top, rgba(59,130,246,0.3) 1px, transparent 1px)'
                        : 'linear-gradient(to right, rgba(226,232,240,0.7) 1px, transparent 1px), linear-gradient(to top, rgba(226,232,240,0.7) 1px, transparent 1px)',
                      backgroundSize: '56px 40px',
                    }}
                  />
                  <Box
                    component="svg"
                    viewBox="0 0 520 160"
                    sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                  >
                    <path
                      d="M0 115 C60 115, 70 118, 120 96 S205 90, 250 108 S345 40, 395 62 S470 135, 520 104"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0 160 L0 115 C60 115, 70 118, 120 96 S205 90, 250 108 S345 40, 395 62 S470 135, 520 104 L520 160 Z"
                      fill={theme.palette.mode === 'dark' ? 'rgba(59,130,246,0.15)' : 'rgba(37,99,235,0.08)'}
                    />
                  </Box>
                </Box>
              </Box>
            </SectionCard>
          </Grid>

          <Grid size={{ xs: 12, lg: 4.5 }}>
            <SectionCard
              title={t('quickActions') || 'Quick Actions'}
              subtitle={t('quickActionsSubtitle') || 'Perform common tasks quickly.'}
              sx={{ height: '100%' }}
            >
              <Grid container spacing={2}>
                {[
                {
                  label: t('addMilkEntry') || 'Record Milk Entry',
                  icon: AddMilkEntryIcon,
                  variant: 'contained',
                  onClick: () => navigate('/milkCollection'),
                },
                {
                  label: t('viewSuppliers') || 'View Suppliers',
                  icon: SuppliersIcon,
                  variant: 'outlined',
                  onClick: () => navigate('/users'),
                },
                {
                  label: t('viewReports') || 'View Reports',
                  icon: ReportsIcon,
                  variant: 'outlined',
                  onClick: () => navigate('/milkReportPage'),
                },
                {
                  label: t('managePricing') || 'Manage Pricing',
                  icon: PricingIcon,
                  variant: 'outlined',
                  onClick: () => navigate('/milkRateSlabs'),
                },
              ].map((action) => {
                const Icon = action.icon;

                return (
                  <Grid key={action.label} size={{ xs: 12, sm: 6, lg: 12 }}>
                    <Button
                      variant={action.variant}
                      fullWidth
                      onClick={action.onClick}
                      startIcon={<Icon />}
                      sx={{
                        minHeight: 52,
                        justifyContent: 'flex-start',
                        px: 2,
                        borderRadius: '10px',
                        fontSize: '0.94rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        backgroundColor: action.variant === 'outlined'
                          ? theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff'
                          : undefined,
                        color: action.variant === 'outlined'
                          ? theme.palette.mode === 'dark' ? '#60a5fa' : '#2563eb'
                          : undefined,
                        border: action.variant === 'outlined'
                          ? `1.5px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb'}`
                          : undefined,
                        '&:hover': {
                          transform: 'translateY(-2px) scale(1.01)',
                          boxShadow:
                            action.variant === 'contained'
                              ? '0 16px 32px rgba(37, 99, 235, 0.24)'
                              : theme.palette.mode === 'dark'
                              ? '0 12px 28px rgba(96, 165, 250, 0.15)'
                              : '0 12px 28px rgba(15, 23, 42, 0.08)',
                          backgroundColor: action.variant === 'outlined'
                            ? theme.palette.mode === 'dark' ? '#2d3748' : '#f9fafb'
                            : undefined,
                        },
                      }}
                    >
                      {action.label}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
            </SectionCard>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontSize: '1.08rem',
              }}
            >
              {t('systemFeatures') || 'Core Features'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 720,
              }}
            >
              {t('systemFeaturesSubtitle') || 'Overview of key system modules.'}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              {
                title: t('milkCollection') || 'Milk Collection',
                description:
                  t('receiveAndTrackMilk') ||
                  'Record and track daily milk entries.',
                icon: MilkIcon,
                accent: '#1976d2',
                bg: 'rgba(25, 118, 210, 0.1)',
              },
              {
                title: t('reporting') || 'Reporting',
                description:
                  t('generateDetailedReports') ||
                  'Generate detailed reports.',
                icon: ReportIcon,
                accent: '#10b981',
                bg: 'rgba(16, 185, 129, 0.1)',
              },
              {
                title: t('supplierManagement') || 'Supplier Management',
                description:
                  t('manageSupplierProfiles') ||
                  'Manage supplier profiles.',
                icon: PeopleIcon,
                accent: '#f97316',
                bg: 'rgba(249, 115, 22, 0.1)',
              },
              {
                title: t('analytics') || 'Analytics',
                description:
                  t('viewTrendsAndMetrics') ||
                  'View trends and performance.',
                icon: TrendingIcon,
                accent: '#06b6d4',
                bg: 'rgba(6, 182, 212, 0.1)',
              },
            ].map((feature) => {
              const Icon = feature.icon;

              return (
                <Grid key={feature.title} size={{ xs: 12, md: 6 }}>
                  <SectionCard
                    noPadding
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      gap: 2,
                      alignItems: 'flex-start',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '12px',
                        background: theme.palette.mode === 'dark'
                          ? `linear-gradient(135deg, ${feature.bg}, rgba(30,41,59,0.9))`
                          : `linear-gradient(135deg, ${feature.bg}, rgba(255,255,255,0.9))`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: theme.palette.mode === 'dark'
                          ? `inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 22px ${feature.bg}`
                          : `inset 0 1px 0 rgba(255,255,255,0.8), 0 10px 22px ${feature.bg}`,
                      }}
                    >
                      <Icon sx={{ color: feature.accent, fontSize: '1.5rem' }} />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          mb: 0.75,
                          fontSize: '1rem',
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          lineHeight: 1.7,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </SectionCard>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </PageContainer>
  );
}
