import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Paper,
  Avatar,
  Typography,
  Chip,
  Tabs,
  Tab,
  Card,
  CardContent,
  TextField,
  IconButton,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import { DataGrid } from '@mui/x-data-grid';
import { API_URLS } from '../config/api';
import DataExportToolbar from './DataExportToolbar';
import { exportToExcel, exportToPDF, handlePrint } from '../utils/exportUtils';
import { PageHeader, SectionCard } from './UIComponents';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserDisplay() {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user || null);
  const [milkCollections, setMilkCollections] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({ total: 0, avgFat: 0, avgSnf: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    fetch(`${API_URLS.getUser}/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load user ${id}`);
        }
        return res.json();
      })
      .then((fetchedUser) => {
        if (!fetchedUser?.id) {
          throw new Error('User data is missing an id');
        }

        setUser(fetchedUser);
        return fetch(`${API_URLS.getMilkCollections}${encodeURIComponent(fetchedUser.id)}`)
          .then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to load milk collections for user ${fetchedUser.id}`);
            }
            return res.json();
          })
          .then((data) => {
            setMilkCollections(data);
            if (data.length > 0) {
              const totalLiters = data.reduce((sum, d) => sum + (parseFloat(d.liters) || 0), 0);
              const avgFat = data.reduce((sum, d) => sum + (parseFloat(d.fat) || 0), 0) / data.length;
              const avgSnf = data.reduce((sum, d) => sum + (parseFloat(d.snf) || 0), 0) / data.length;
              setStats({
                total: totalLiters.toFixed(2),
                avgFat: avgFat.toFixed(2),
                avgSnf: avgSnf.toFixed(2),
              });
            }
          });
      })
      .catch((err) => {
        setError(
          err.message ||
            t('loadingProfileFailed', 'Something went wrong while loading the profile.')
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, t]);

  const handleTabChange = (e, val) => setTabValue(val);
  if (loading && !user) {
    return <Typography sx={{ p: 3, color: '#212121' }}>{t('loading', 'Loading...')}</Typography>;
  }
  if (error && !user) return <Typography sx={{ p: 3, color: 'error.main' }}>{error}</Typography>;

  const columns = [
    { field: 'date', headerName: t('date', 'Date'), flex: 1, minWidth: 120 },
    { field: 'time', headerName: t('time', 'Shift'), flex: 1, minWidth: 100 },
    { field: 'animalType', headerName: t('animalType', 'Animal Type'), flex: 1, minWidth: 100 },
    { field: 'liters', headerName: t('liters', 'Liters'), flex: 1, minWidth: 80 },
    { field: 'fat', headerName: t('fat', 'Fat'), flex: 1, minWidth: 80 },
    { field: 'snf', headerName: t('snf', 'SNF'), flex: 1, minWidth: 80 },
    { field: 'rate', headerName: t('rate', 'Rate'), flex: 1, minWidth: 100 },
    { field: 'amount', headerName: 'Amount', flex: 1, minWidth: 100 },
  ];
  const exportRows = milkCollections.map((row) => ({
    ...row,
    amount: row.amount ?? (Number(row.rate) || 0) * (Number(row.liters) || 0),
  }));
  const exportColumns = [
    { key: 'date', header: t('date', 'Date'), type: 'date' },
    { key: 'time', header: t('time', 'Shift') },
    { key: 'animalType', header: t('animalType', 'Animal Type') },
    { key: 'liters', header: t('liters', 'Liters'), type: 'number' },
    { key: 'fat', header: t('fat', 'Fat'), type: 'number' },
    { key: 'snf', header: t('snf', 'SNF'), type: 'number' },
    { key: 'rate', header: t('rate', 'Rate'), type: 'number' },
    { key: 'amount', header: 'Amount', type: 'number' },
  ];
  const exportSummary = [
    { label: 'Supplier', value: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown' },
    { label: t('totalMilk', 'Total Milk Collected'), value: stats.total },
    { label: 'Average Fat', value: stats.avgFat },
    { label: 'Average SNF', value: stats.avgSnf },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <PageHeader
        title={t('profileOverview', 'Profile Overview')}
        subtitle="View supplier details, account information, and collection history."
        sx={{ mb: 0 }}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '280px minmax(0, 1fr)' }, gap: 3 }}>
      <SectionCard
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: { lg: 'calc(100vh - 220px)' },
        }}
      >
        <Avatar
          sx={{
            background: 'linear-gradient(135deg, #2563eb, #60a5fa)',
            width: 90,
            height: 90,
            fontSize: '2.2rem',
            mb: 2,
            boxShadow: '0 8px 18px rgba(37, 99, 235, 0.18)',
          }}
        >
          {user.firstName?.charAt(0) || 'U'}
        </Avatar>

        <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center', color: 'text.primary' }}>
          {`${user.firstName || ''} ${user.lastName || ''}`}
        </Typography>

        <Typography
          variant="body2"
          sx={{ textAlign: 'center', color: 'text.secondary', mt: 0.5, mb: 1 }}
        >
          {user.userEmail || '-'}
        </Typography>

        <Chip label={t('active', 'Active')} color="success" size="small" sx={{ mb: 3, fontWeight: 600 }} />

        <Divider sx={{ width: '100%', borderColor: '#e6e6e6', mb: 3 }} />

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <IconButton sx={{ bgcolor: 'rgba(37,99,235,0.08)', color: 'primary.main', '&:hover': { bgcolor: 'rgba(37,99,235,0.14)' } }}>
            <EditIcon />
          </IconButton>
          <IconButton sx={{ bgcolor: 'rgba(37,99,235,0.08)', color: 'primary.main', '&:hover': { bgcolor: 'rgba(37,99,235,0.14)' } }}>
            <LockIcon />
          </IconButton>
          <IconButton sx={{ bgcolor: 'rgba(37,99,235,0.08)', color: 'primary.main', '&:hover': { bgcolor: 'rgba(37,99,235,0.14)' } }}>
            <RefreshIcon />
          </IconButton>
        </Box>

        <Box sx={{ mt: 'auto', textAlign: 'center', pb: 2 }}>
          <Typography variant="caption" sx={{ opacity: 0.9, color: 'text.secondary' }}>
            {t('lastLogin', 'Last Login')}: 2 hrs ago
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', opacity: 0.9, color: 'text.secondary' }}>
            {t('memberSince', 'Member Since')} 2022
          </Typography>
        </Box>
      </SectionCard>

      <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {error && (
          <Alert severity="error">{error}</Alert>
        )}

        <SectionCard noPadding>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            centered
            sx={{ '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', fontSize: '1rem' } }}
          >
            <Tab icon={<PersonIcon />} label={t('profileDetails', 'Profile Details')} iconPosition="start" />
            <Tab icon={<LockIcon />} label={t('security', 'Security')} iconPosition="start" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 100%', '@media(min-width:900px)': { flex: '1 1 48%' } }}>
                <Card sx={{ p: 3, borderRadius: '12px', boxShadow: 'none' }}>
                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    {t('personalInformation', 'Personal Information')}
                  </Typography>
                  <TextField fullWidth label={t('username', 'Username')} value={user.username || ''} sx={{ mb: 2 }} disabled />
                  <TextField fullWidth label={t('dob', 'Date of Birth')} value={user.dob || ''} sx={{ mb: 2 }} disabled />
                  <TextField fullWidth label={t('userGender', 'Gender')} value={user.userGender || ''} disabled />
                </Card>
              </Box>
              <Box sx={{ flex: '1 1 100%', '@media(min-width:900px)': { flex: '1 1 48%' } }}>
                <Card sx={{ p: 3, borderRadius: '12px', boxShadow: 'none' }}>
                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    {t('contactInformation', 'Contact Information')}
                  </Typography>
                  <TextField fullWidth label={t('userEmail', 'Email Address')} value={user.userEmail || ''} sx={{ mb: 2 }} disabled />
                  <TextField fullWidth label={t('userMobile', 'Mobile Number')} value={user.userMobile || ''} disabled />
                </Card>
              </Box>
            </Box>
          </TabPanel>
        </SectionCard>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 4 }}>
          <Box sx={{ flex: '1 1 100%', '@media(min-width:600px)': { flex: '1 1 32%' } }}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(37,99,235,0.08)', borderRadius: '12px', boxShadow: 'none' }}>
              <Typography variant="h6" color="primary">{t('totalMilk', 'Total Milk Collected')}</Typography>
              <Typography variant="h4" fontWeight={700}>{stats.total}</Typography>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 100%', '@media(min-width:600px)': { flex: '1 1 32%' } }}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(16,185,129,0.08)', borderRadius: '12px', boxShadow: 'none' }}>
              <Typography variant="h6" color="success.main">Average Fat</Typography>
              <Typography variant="h4" fontWeight={700}>{stats.avgFat}</Typography>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 100%', '@media(min-width:600px)': { flex: '1 1 32%' } }}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(245,158,11,0.1)', borderRadius: '12px', boxShadow: 'none' }}>
              <Typography variant="h6" color="warning.main">Average SNF</Typography>
              <Typography variant="h4" fontWeight={700}>{stats.avgSnf}</Typography>
            </Card>
          </Box>
        </Box>

        {/* Milk Collection Table */}
        <SectionCard sx={{ mt: 1 }}>
          <CardContent>
            <Box
              className="no-print"
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
                alignItems: 'center',
                mb: 2,
                flexWrap: 'wrap',
              }}
            >
              <Typography variant="h6" color="primary">
                {t('milkCollectionRecords', 'Milk Collection Records')}
              </Typography>
              <DataExportToolbar
                onExcel={() =>
                  exportToExcel({
                    data: exportRows,
                    columns: exportColumns,
                    fileBaseName: `UserMilkRecords_${user.id || 'profile'}`,
                    sheetName: 'MilkRecords',
                  })
                }
                onPDF={() =>
                  exportToPDF({
                    data: exportRows,
                    columns: exportColumns,
                    title: t('milkCollectionRecords', 'Milk Collection Records'),
                    fileBaseName: `UserMilkRecords_${user.id || 'profile'}`,
                    summary: exportSummary,
                  })
                }
                onPrint={() =>
                  handlePrint({
                    data: exportRows,
                    columns: exportColumns,
                    title: t('milkCollectionRecords', 'Milk Collection Records'),
                    summary: exportSummary,
                  })
                }
              />
            </Box>
            <Box
              sx={{
                height: 420,
                '& .MuiDataGrid-columnHeaders': { bgcolor: 'rgba(37,99,235,0.08)', color: '#2563eb', fontWeight: 700, borderBottom: '1px solid #e6e6e6' },
                '& .MuiDataGrid-cell': { color: '#212121' },
                '& .MuiDataGrid-row:nth-of-type(even)': { backgroundColor: '#fafafa' },
                '& .MuiDataGrid-row:hover': { backgroundColor: 'rgba(37,99,235,0.04)', transition: '0.2s' },
              }}
            >
              <DataGrid
                rows={milkCollections.map((d, i) => ({ id: i + 1, ...d }))}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10, 25]}
              />
            </Box>
          </CardContent>
        </SectionCard>
      </Box>
      </Box>
    </Box>
  );
}
