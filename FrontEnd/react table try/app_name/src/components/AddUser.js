import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URLS } from '../config/api';
import { useTranslation } from 'react-i18next';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Alert,
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  useTheme,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  Info as InfoIcon,
  ContactMail as ContactMailIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';

// Helper function to calculate age from date of birth
const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export default function AddUser({ userId, userData, refreshData, onClose }) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    username: '',        // Added
    createdAt: '',       // Added
    updatedAt: '',       // Added
    password: '',
    role: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    userMobile: '',
    userEmail: '',
    userAge: '',
    userGender: '',
    userActiveInactive: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  // When editing user, pre-fill the form
  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || '',
        createdAt: userData.createdAt || '',
        updatedAt: userData.updatedAt || '',
        password: '', // don't prefill password for security reasons
        role: userData.role || '',
        firstName: userData.firstName || '',
        middleName: userData.middleName || '',
        lastName: userData.lastName || '',
        dob: userData.dob || '',
        userMobile: userData.userMobile || '',
        userEmail: userData.userEmail || '',
        userAge: userData.userAge || '',
        userGender: userData.userGender || '',
        userActiveInactive: userData.userActiveInactive || '',
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date().toISOString();
    // Create payload with timestamps
    const payload = {
      ...formData,
      updatedAt: now,
    };
    if (!userId) {
      // Only add createdAt for new user
      payload.createdAt = now;
    }

    try {
      if (userId) {
        // Update existing user (PUT)
        await axios.put(`${API_URLS.updateUser}/${userId}`, payload);
        alert('User updated successfully!');
      } else {
        // Add new user (POST)
        await axios.post(API_URLS.addUser, payload);
        alert('User added successfully!');
      }
      setErrorMessage('');
      refreshData();
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      const message =
        error.response && error.response.data
          ? error.response.data
          : 'Failed to save user';
      setErrorMessage(message);
    }
  };

  const theme = useTheme();

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Paper 
        elevation={4} 
        sx={{ 
          p: { xs: 3, sm: 5 },
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: (theme) => `0 0 20px ${theme.palette.action.hover}`,
          width: '100%'
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            fontWeight: 500,
            color: 'primary.main',
            mb: 1
          }}
        >
          {userId ? t('updateUser') : t('addNewUser')}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4,
            color: 'text.secondary',
            fontSize: '1.1rem'
          }}
        >
          {t('fillUserDetails')}
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>

          {/* Show read-only fields only when editing */}
          {userId && (
            <>
              <TextField
                label={t('username')}
                name="username"
                value={formData.username}
                InputProps={{ readOnly: true }}
                fullWidth
                margin="normal"
              />
              
            </>
          )}

          <Box sx={{ mb: 3 }}>
            <TextField
              label={t('role')}
              name="role"
              value={formData.role}
              onChange={handleChange}
              fullWidth
              required
              helperText={!formData.role && t('required')}
              error={!formData.role}
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  bgcolor: 'background.paper',
                  '&.Mui-focused': {
                    boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.light}`,
                  }
                }
              }}
            />
          </Box>
          <Divider sx={{ my: 3 }} />



          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Tooltip title={t('firstNameTooltip')} placement="top">
                <TextField
                  label={t('firstName')}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      bgcolor: 'background.paper',
                      '&.Mui-focused': {
                        boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.light}`,
                      }
                    },
                    width: '100%'
                  }}
                  helperText={
                    !formData.firstName 
                      ? t('required') 
                      : t('firstNameHelper')
                  }
                  error={!formData.firstName}
                  InputProps={{
                    endAdornment: (
                      <Tooltip title={t('firstNameInfo')}>
                        <IconButton size="small">
                          <InfoIcon fontSize="small" color="action" />
                        </IconButton>
                      </Tooltip>
                    ),
                  }}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label={t('middleName')}
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                fullWidth
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    bgcolor: 'background.paper',
                    '&.Mui-focused': {
                      boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.light}`,
                    }
                  },
                  width: '100%'
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label={t('lastName')}
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                fullWidth
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    bgcolor: 'background.paper',
                    '&.Mui-focused': {
                      boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.light}`,
                    }
                  },
                  width: '100%'
                }}
                helperText={!formData.lastName && t('required')}
                error={!formData.lastName}
              />
            </Grid>
          </Grid>

          <Box sx={{ mb: 3 }}>
            <TextField
              label={t('dob')}
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  bgcolor: 'background.paper',
                  '&.Mui-focused': {
                    boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.light}`,
                  }
                }
              }}
              helperText={formData.dob ? `${t('age')}: ${calculateAge(formData.dob)} ${t('years')}` : t('required')}
              error={!formData.dob}
            />
          </Box>
          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('userMobile')}
                name="userMobile"
                value={formData.userMobile}
                onChange={handleChange}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label={t('userEmail')}
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                fullWidth
                type="email"
                required
                helperText={!formData.userEmail && t('required')}
                error={!formData.userEmail}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    bgcolor: 'background.paper',
                    '&.Mui-focused': {
                      boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.light}`,
                    }
                  }
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mb: 3 }}>
            <TextField
              label={t('password')}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required={!userId} // required only when adding new user
              helperText={userId ? t('leaveBlankPassword') : ''}
            />
          </Box>
          <Divider sx={{ my: 3 }} />



          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <TextField
                label={t('userAge')}
                name="userAge"
                value={formData.userAge}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl 
                fullWidth
                required
                error={!formData.userGender}
              >
                <InputLabel>{t('userGender')}</InputLabel>
                <Select
                  name="userGender"
                  value={formData.userGender}
                  onChange={handleChange}
                  sx={{ 
                    bgcolor: 'background.paper',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.light}`,
                    }
                  }}
                >
                  <MenuItem value="">{t('select')}</MenuItem>
                  <MenuItem value="Male">{t('male')}</MenuItem>
                  <MenuItem value="Female">{t('female')}</MenuItem>
                  <MenuItem value="Other">{t('other')}</MenuItem>
                </Select>
                {!formData.userGender && (
                  <FormHelperText error>{t('required')}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl 
                fullWidth
                required
                error={!formData.userActiveInactive}
              >
                <InputLabel>{t('userActiveInactive')}</InputLabel>
                <Select
                  name="userActiveInactive"
                  value={formData.userActiveInactive}
                  onChange={handleChange}
                  sx={{ 
                    bgcolor: 'background.paper',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.light}`,
                    }
                  }}
                >
                  <MenuItem value="">{t('select')}</MenuItem>
                  <MenuItem value="Active">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box 
                        sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: 'success.main' 
                        }} 
                      />
                      {t('active')}
                    </Box>
                  </MenuItem>
                  <MenuItem value="Inactive">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box 
                        sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: 'text.disabled' 
                        }} 
                      />
                      {t('inactive')}
                    </Box>
                  </MenuItem>
                </Select>
                {!formData.userActiveInactive && (
                  <FormHelperText error>{t('required')}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>

          {userId && (
            <>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t('createdAt')}
                    name="createdAt"
                    value={new Date(formData.createdAt).toLocaleString()}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t('updatedAt')}
                    name="updatedAt"
                    value={new Date(formData.updatedAt).toLocaleString()}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </>
          )}

          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mt: 4,
            '& .MuiButton-root': {
              px: 4,
              py: 1,
              fontSize: '1rem'
            }
          }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'translateY(-1px)',
                  boxShadow: (theme) => theme.shadows[4],
                },
                transition: 'all 0.2s'
              }}
            >
              {userId ? t('update') : t('submit')}
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              size="large"
              onClick={onClose}
              sx={{
                borderColor: 'grey.300',
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'grey.50',
                  borderColor: 'grey.400'
                }
              }}
            >
              {t('cancel')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
