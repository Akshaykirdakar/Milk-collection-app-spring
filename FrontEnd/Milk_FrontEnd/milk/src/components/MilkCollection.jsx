import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { useTranslation } from 'react-i18next';
import { API_URLS } from '../config/api';

import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  CircularProgress,
  Typography,
  Paper,
  Box,
  Grid,
} from '@mui/material';

export default function AddMilkEntry({ refreshData, onClose }) {
  const { t } = useTranslation();

  const today = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  const defaultFY = `${currentYear}-${currentYear + 1}`;

  const getFinancialYears = () => {
    const startYear = 2000;
    const endYear = currentYear + 1;
    const years = [];
    for (let y = startYear; y <= endYear; y++) {
      years.push(`${y}-${y + 1}`);
    }
    return years.reverse();
  };

  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [supplierError, setSupplierError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFYStartEnd = (yearRange) => {
    const [startYearStr, endYearStr] = yearRange.split('-');
    const startYear = parseInt(startYearStr, 10);
    const endYear = parseInt(endYearStr, 10);
    return {
      startDate: new Date(startYear, 3, 1).toISOString().split('T')[0],
      endDate: new Date(endYear, 2, 31).toISOString().split('T')[0],
    };
  };

  const defaultDate = (() => {
    const { startDate } = getFYStartEnd(defaultFY);
    const todayObj = new Date(today);
    const fyStart = new Date(startDate);
    return todayObj >= fyStart ? today : startDate;
  })();

  const [formData, setFormData] = useState({
    supplierName: '',
    userID: '',
    year: defaultFY,
    date: defaultDate,
    time: 1,
    animalType: 1,
    liters: '',
    fat: '',
    clr: '',
    snf: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoadingSuppliers(true);
      try {
        const response = await axios.get(API_URLS.getUser);
        const supplierList = response.data.map((user) => ({
          name: [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' '),
          userID: user.id
        })).sort((a, b) => a.name.localeCompare(b.name));
        setSuppliers(supplierList);
        if (supplierList.length > 0) {
          setFormData((prev) => ({ ...prev, supplierName: supplierList[0].name, userID: supplierList[0].userID }));
        }
        setSupplierError('');
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
        setSupplierError(t('error.fetchSuppliers') || 'Failed to load suppliers');
      } finally {
        setLoadingSuppliers(false);
      }
    };
    fetchSuppliers();
  }, [t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let newData = { ...prev, [name]: value };
      if (name === 'supplierName') {
        const selected = suppliers.find(s => s.name === value);
        newData.userID = selected ? selected.userID : '';
      } else if (name === 'userID') {
        const selected = suppliers.find(s => String(s.userID) === value);
        newData.supplierName = selected ? selected.name : '';
      }
      if (name === 'year') {
        const { startDate, endDate } = getFYStartEnd(value);
        const dateObj = new Date(newData.date);
        const fyStart = new Date(startDate);
        const fyEnd = new Date(endDate);

        const todayObj = new Date();
        const todayISO = todayObj.toISOString().split('T')[0];
        if (value === defaultFY && todayObj >= fyStart && todayObj <= fyEnd) {
          newData.date = todayISO;
        } else if (dateObj < fyStart || dateObj > fyEnd) {
          newData.date = startDate;
        }
      }
      return newData;
    });
  };

  const computeDateLimits = () => {
    return getFYStartEnd(formData.year);
  };

  const { startDate: minDate, endDate: maxDate } = computeDateLimits();

  const validateForm = () => {
    if (!formData.supplierName || !formData.date || !formData.liters || !formData.fat || !formData.clr || !formData.snf) {
      setErrorMessage(t('error.allFieldsRequired') || 'Please fill in all required fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear all messages before submission
    setErrorMessage('');
    setSuccessMessage('');
    setSupplierError('');
    if (!validateForm()) return;
    setIsSubmitting(true);
    console.log(formData);
    try {
      await axios.post(API_URLS.addMilkEntry, formData);
      setErrorMessage(''); // Clear any previous error
      setSuccessMessage(t('success.entryAdded') || 'Milk entry added successfully!');
      if (typeof refreshData === 'function') {
        refreshData();
      }
      if (typeof onClose === 'function') {
        onClose();
      }
    } catch (error) {
      setSuccessMessage(''); // Clear any previous success message
      let message = error.response?.data || t('error.submitFailed') || 'Failed to add milk entry';
      if (typeof message === 'object' && message !== null) {
        message = message.message || JSON.stringify(message);
      }
      // Handle specific error for missing rate detail
      if (typeof message === 'string' && message.includes('No rate detail found for given fat and snf')) {
        setErrorMessage(t('error.noRateDetail') || 'No rate detail found for given fat and snf. Please check fat and snf values.');
      } else if (typeof message === 'string' && message.startsWith('Error: ')) {
        setErrorMessage(message.replace(/^Error: /, ''));
      } else {
        setErrorMessage(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      supplierName: suppliers[0] ? suppliers[0].name : '',
      userID: suppliers[0] ? suppliers[0].userID : '',
      year: defaultFY,
      date: defaultDate,
      time: 1,
      animalType: 1,
      liters: '',
      fat: '',
      clr: '',
      snf: ''
    });
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <Box sx={{ 
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      p: { xs: 2, sm: 3 },
    }}>
      <Box sx={{ width: '100%', maxWidth: '900px' }}>
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 500,
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              color: '#1a1a1a',
              mb: 0.5,
            }}
          >
            {t('addMilkEntry') || 'Record Milk Entry'}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              fontSize: '0.9rem',
            }}
          >
            {t('fillMilkEntryDetails') || 'Enter the milk collection details below.'}
          </Typography>
        </Box>

        {/* Main Card Container */}
        <Paper 
          elevation={0} 
          sx={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            p: { xs: 2.5, sm: 3.5 },
            transition: 'all 0.2s ease',
          }}
        >
          {/* Alert Section - Top */}
          {errorMessage ? (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2.5,
                py: 1.25,
                px: 1.75,
                fontSize: '0.875rem',
                border: '1px solid #ffcdd2',
                backgroundColor: '#ffebee',
                borderRadius: '6px',
                '& .MuiAlert-icon': { mr: 1.25, fontSize: '1.2rem' }
              }}
            >
              {errorMessage}
            </Alert>
          ) : successMessage ? (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 2.5,
                py: 1.25,
                px: 1.75,
                fontSize: '0.875rem',
                border: '1px solid #c8e6c9',
                backgroundColor: '#f1f8e9',
                borderRadius: '6px',
                '& .MuiAlert-icon': { mr: 1.25, fontSize: '1.2rem' }
              }}
            >
              {successMessage}
            </Alert>
          ) : supplierError ? (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2.5,
                py: 1.25,
                px: 1.75,
                fontSize: '0.875rem',
                border: '1px solid #ffcdd2',
                backgroundColor: '#ffebee',
                borderRadius: '6px',
                '& .MuiAlert-icon': { mr: 1.25, fontSize: '1.2rem' }
              }}
            >
              {supplierError}
            </Alert>
          ) : null}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              {/* Row 1: Year & Date */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required size="small">
                  <InputLabel sx={{ fontSize: '0.875rem' }}>
                    {t('year') || 'Financial Year'}
                  </InputLabel>
                  <Select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    label={t('year') || 'Financial Year'}
                    sx={{
                      fontSize: '0.875rem',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#d5d5d5',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#999',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                        borderWidth: '1px',
                      },
                    }}
                  >
                    {getFinancialYears().map((fy) => (
                      <MenuItem key={fy} value={fy} sx={{ fontSize: '0.875rem' }}>
                        {fy}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('date') || 'Date'}
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  size="small"
                  inputProps={{ min: minDate, max: maxDate }}
                  sx={{
                    fontSize: '0.875rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d5d5d5',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#999',
                    },
                  }}
                />
              </Grid>

              {/* Row 2: User ID & Supplier Name */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label={t('userID') || 'User ID'}
                  name="userID"
                  value={formData.userID}
                  onChange={handleChange}
                  type="number"
                  required
                  size="small"
                  inputProps={{ min: 0 }}
                  sx={{
                    fontSize: '0.875rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d5d5d5',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#999',
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 8 }}>
                <FormControl fullWidth required size="small">
                  <InputLabel sx={{ fontSize: '0.875rem' }}>
                    {t('supplierName') || 'Supplier Name'}
                  </InputLabel>
                  {loadingSuppliers ? (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      py: 1.5,
                    }}>
                      <CircularProgress size={20} />
                    </Box>
                  ) : (
                    <Select
                      name="supplierName"
                      value={formData.supplierName}
                      onChange={handleChange}
                      label={t('supplierName') || 'Supplier Name'}
                      sx={{
                        fontSize: '0.875rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#d5d5d5',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#999',
                        },
                      }}
                    >
                      {suppliers.map((s) => (
                        <MenuItem 
                          key={s.userID} 
                          value={s.name}
                          sx={{ fontSize: '0.875rem' }}
                        >
                          {s.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </FormControl>
              </Grid>

              {/* Row 3: Time & Animal Type */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required size="small">
                  <InputLabel sx={{ fontSize: '0.875rem' }}>
                    {t('time') || 'Shift'}
                  </InputLabel>
                  <Select 
                    name="time" 
                    value={formData.time} 
                    onChange={handleChange}
                    label={t('time') || 'Shift'}
                    sx={{
                      fontSize: '0.875rem',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#d5d5d5',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#999',
                      },
                    }}
                  >
                    <MenuItem value={1} sx={{ fontSize: '0.875rem' }}>
                      {t('morning') || 'Morning'}
                    </MenuItem>
                    <MenuItem value={2} sx={{ fontSize: '0.875rem' }}>
                      {t('evening') || 'Evening'}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required size="small">
                  <InputLabel sx={{ fontSize: '0.875rem' }}>
                    {t('animalType') || 'Animal Type'}
                  </InputLabel>
                  <Select 
                    name="animalType" 
                    value={formData.animalType} 
                    onChange={handleChange}
                    label={t('animalType') || 'Animal Type'}
                    sx={{
                      fontSize: '0.875rem',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#d5d5d5',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#999',
                      },
                    }}
                  >
                    <MenuItem value={1} sx={{ fontSize: '0.875rem' }}>
                      {t('cow') || 'Cow'}
                    </MenuItem>
                    <MenuItem value={2} sx={{ fontSize: '0.875rem' }}>
                      {t('buffalo') || 'Buffalo'}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Row 4: Liters, Fat, CLR, SNF */}
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField 
                  fullWidth
                  label={t('liters') || 'Liters'} 
                  name="liters" 
                  type="number" 
                  value={formData.liters} 
                  onChange={handleChange} 
                  required 
                  size="small"
                  inputProps={{ min: 0, step: 'any' }}
                  sx={{
                    fontSize: '0.875rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d5d5d5',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#999',
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField 
                  fullWidth
                  label={t('fat') || 'Fat'} 
                  name="fat" 
                  type="number" 
                  value={formData.fat} 
                  onChange={handleChange} 
                  required 
                  size="small"
                  inputProps={{ min: 0, step: 'any' }}
                  sx={{
                    fontSize: '0.875rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d5d5d5',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#999',
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField 
                  fullWidth
                  label={t('clr') || 'CLR'} 
                  name="clr" 
                  type="number" 
                  value={formData.clr} 
                  onChange={handleChange} 
                  required 
                  size="small"
                  inputProps={{ min: 0, step: 'any' }}
                  sx={{
                    fontSize: '0.875rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d5d5d5',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#999',
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField 
                  fullWidth
                  label={t('snf') || 'SNF'} 
                  name="snf" 
                  type="number" 
                  value={formData.snf} 
                  onChange={handleChange} 
                  required 
                  size="small"
                  inputProps={{ min: 0, step: 'any' }}
                  sx={{
                    fontSize: '0.875rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d5d5d5',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#999',
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Button Section */}
            <Box sx={{ 
              display: 'flex', 
              gap: 1.5, 
              mt: 3.5,
              flexDirection: { xs: 'column-reverse', sm: 'row' },
              justifyContent: 'flex-end',
            }}>
              <Button 
                variant="outlined"
                onClick={onClose}
                size="small"
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  px: { xs: 2, sm: 2.5 },
                  py: 0.75,
                  borderColor: '#d5d5d5',
                  color: '#555',
                  backgroundColor: '#ffffff',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#f8f8f8',
                    borderColor: '#999',
                    boxShadow: 'none',
                  }
                }}
              >
                {t('cancel') || 'Cancel'}
              </Button>

              <Button 
                variant="outlined"
                onClick={handleReset}
                size="small"
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  px: { xs: 2, sm: 2.5 },
                  py: 0.75,
                  borderColor: '#d5d5d5',
                  color: '#555',
                  backgroundColor: '#ffffff',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#f8f8f8',
                    borderColor: '#999',
                    boxShadow: 'none',
                  }
                }}
              >
                {t('reset') || 'Reset'}
              </Button>

              <Button 
                type="submit" 
                variant="contained"
                disabled={isSubmitting}
                size="small"
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  px: { xs: 2, sm: 3 },
                  py: 0.75,
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  boxShadow: 'none',
                  border: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                    boxShadow: 'none',
                  },
                  '&:disabled': {
                    backgroundColor: '#ccc',
                    color: '#999',
                    cursor: 'not-allowed',
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={14} sx={{ mr: 0.75, color: 'inherit' }} />
                    {t('submitting') || 'Submitting...'}
                  </>
                ) : (
                  t('submit') || 'Submit'
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
