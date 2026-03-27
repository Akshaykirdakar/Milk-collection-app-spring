import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
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

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserDisplay() {
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
        setError(err.message || 'Something went wrong while loading the profile');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleTabChange = (e, val) => setTabValue(val);
  if (loading && !user) return <Typography sx={{ p: 3, color: '#212121' }}>Loading...</Typography>;
  if (error && !user) return <Typography sx={{ p: 3, color: 'error.main' }}>{error}</Typography>;

  const columns = [
    { field: 'date', headerName: 'Date', flex: 1, minWidth: 120 },
    { field: 'time', headerName: 'Time', flex: 1, minWidth: 100 },
    { field: 'animalType', headerName: 'Animal', flex: 1, minWidth: 100 },
    { field: 'liters', headerName: 'Liters', flex: 1, minWidth: 80 },
    { field: 'fat', headerName: 'Fat', flex: 1, minWidth: 80 },
    { field: 'snf', headerName: 'SNF', flex: 1, minWidth: 80 },
    { field: 'rate', headerName: 'Rate', flex: 1, minWidth: 100 },
    { field: 'amount', headerName: 'Amount', flex: 1, minWidth: 100 },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f6f8fb', height: '100vh', overflow: 'hidden' }}>
      {/* Left Sidebar */}
      <Box
        sx={{
          width: 280,
          bgcolor: '#1565c0',
          color: '#fff',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          height: '100vh',
          boxShadow: '4px 0 15px rgba(0,0,0,0.1)',
        }}
      >
        <Avatar
          sx={{
            bgcolor: '#42a5f5',
            width: 90,
            height: 90,
            fontSize: '2.2rem',
            mb: 2,
            boxShadow: '0 4px 10px rgba(255,255,255,0.3)',
          }}
        >
          {user.firstName?.charAt(0) || 'U'}
        </Avatar>

        <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center', color: '#fff' }}>
          {`${user.firstName || ''} ${user.lastName || ''}`}
        </Typography>

        <Typography
          variant="body2"
          sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.95)', mt: 0.5, mb: 1 }}
        >
          {user.userEmail || '-'}
        </Typography>

        <Chip label="Active" color="success" size="small" sx={{ mb: 3, fontWeight: 600 }} />

        <Divider sx={{ width: '80%', borderColor: 'rgba(255,255,255,0.2)', mb: 3 }} />

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
            <EditIcon />
          </IconButton>
          <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
            <LockIcon />
          </IconButton>
          <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
            <RefreshIcon />
          </IconButton>
        </Box>

        <Box sx={{ mt: 'auto', textAlign: 'center', pb: 2 }}>
          <Typography variant="caption" sx={{ opacity: 0.9, color: '#fff' }}>
            Last Login: 2 hrs ago
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', opacity: 0.9, color: '#fff' }}>
            Member since 2022
          </Typography>
        </Box>
      </Box>

      {/* Right Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 4, color: '#212121' }}>
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1e88e5, #42a5f5)',
            color: 'white',
            p: 4,
            borderRadius: 4,
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            mb: 4,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Profile Overview
          </Typography>
          {error && (
            <Typography sx={{ mt: 1, opacity: 0.95 }}>
              {error}
            </Typography>
          )}
        </Box>

        {/* Tabs */}
        <Paper elevation={3} sx={{ borderRadius: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            centered
            sx={{ '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', fontSize: '1rem' } }}
          >
            <Tab icon={<PersonIcon />} label="Profile Details" iconPosition="start" />
            <Tab icon={<LockIcon />} label="Security" iconPosition="start" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 100%', '@media(min-width:900px)': { flex: '1 1 48%' } }}>
                <Card sx={{ p: 3, borderRadius: 4 }}>
                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    Personal Information
                  </Typography>
                  <TextField fullWidth label="Username" value={user.username || ''} sx={{ mb: 2 }} disabled InputProps={{ style: { color: '#212121' } }} />
                  <TextField fullWidth label="Date of Birth" value={user.dob || ''} sx={{ mb: 2 }} disabled InputProps={{ style: { color: '#212121' } }} />
                  <TextField fullWidth label="Gender" value={user.userGender || ''} disabled InputProps={{ style: { color: '#212121' } }} />
                </Card>
              </Box>
              <Box sx={{ flex: '1 1 100%', '@media(min-width:900px)': { flex: '1 1 48%' } }}>
                <Card sx={{ p: 3, borderRadius: 4 }}>
                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    Contact Information
                  </Typography>
                  <TextField fullWidth label="Email" value={user.userEmail || ''} sx={{ mb: 2 }} disabled InputProps={{ style: { color: '#212121' } }} />
                  <TextField fullWidth label="Mobile" value={user.userMobile || ''} disabled InputProps={{ style: { color: '#212121' } }} />
                </Card>
              </Box>
            </Box>
          </TabPanel>
        </Paper>

        {/* Summary Cards */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 4 }}>
          <Box sx={{ flex: '1 1 100%', '@media(min-width:600px)': { flex: '1 1 32%' } }}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: '#e3f2fd', borderRadius: 4 }}>
              <Typography variant="h6" color="primary">Total Milk (L)</Typography>
              <Typography variant="h4" fontWeight={700}>{stats.total}</Typography>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 100%', '@media(min-width:600px)': { flex: '1 1 32%' } }}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: '#f1f8e9', borderRadius: 4 }}>
              <Typography variant="h6" color="success.main">Average Fat</Typography>
              <Typography variant="h4" fontWeight={700}>{stats.avgFat}</Typography>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 100%', '@media(min-width:600px)': { flex: '1 1 32%' } }}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: '#fff3e0', borderRadius: 4 }}>
              <Typography variant="h6" color="warning.main">Average SNF</Typography>
              <Typography variant="h4" fontWeight={700}>{stats.avgSnf}</Typography>
            </Card>
          </Box>
        </Box>

        {/* Milk Collection Table */}
        <Card sx={{ mt: 5, borderRadius: 4, boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
              Milk Collection Records
            </Typography>
            <Box
              sx={{
                height: 420,
                '& .MuiDataGrid-columnHeaders': { bgcolor: '#1976d2', color: '#fff', fontWeight: 600, borderBottom: '2px solid #1565c0' },
                '& .MuiDataGrid-cell': { color: '#212121' },
                '& .MuiDataGrid-row:nth-of-type(even)': { backgroundColor: '#f9f9f9' },
                '& .MuiDataGrid-row:hover': { backgroundColor: '#e3f2fd', transition: '0.2s' },
              }}
            >
              <DataGrid
                rows={milkCollections.map((d, i) => ({ id: i + 1, ...d }))}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
