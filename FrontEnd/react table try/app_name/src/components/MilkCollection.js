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
      p: 3,
      maxWidth: 800,
      mx: 'auto',
    }}>
      <Paper 
        elevation={0} 
        variant="outlined" 
        sx={{ 
          p: 3,
          borderRadius: 2
        }}
      >
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
          {t('addMilkEntry') || 'Add Milk Entry'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t('fillMilkEntryDetails') || 'Fill in the milk entry details below'}
        </Typography>

        {/* Show only one message at a time: error > success > supplierError */}
        {errorMessage ? (
          <Alert severity="error" sx={{ mb: 3 }}>{errorMessage}</Alert>
        ) : successMessage ? (
          <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>
        ) : supplierError ? (
          <Alert severity="error" sx={{ mb: 3 }}>{supplierError}</Alert>
        ) : null}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gap: 3,
            }}>
              <FormControl required>
                <InputLabel>{t('year') || 'Year'}</InputLabel>
                <Select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  label={t('year') || 'Year'}
                >
                  {getFinancialYears().map((fy) => (
                    <MenuItem key={fy} value={fy}>{fy}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label={t('date') || 'Date'}
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                inputProps={{ min: minDate, max: maxDate }}
              />
            </Box>

            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: 'minmax(120px, 1fr) minmax(300px, 2fr)',
              gap: 3,
              alignItems: 'flex-start'
            }}>
              <TextField
                label={t('userID') || 'User ID'}
                name="userID"
                value={formData.userID}
                onChange={handleChange}
                type="number"
                required
                inputProps={{ min: 0 }}
              />

              <FormControl required>
                <InputLabel>{t('supplierName') || 'Supplier Name'}</InputLabel>
                {loadingSuppliers ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', pt: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <Select
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleChange}
                    label={t('supplierName') || 'Supplier Name'}
                  >
                    {suppliers.map((s) => (
                      <MenuItem key={s.userID} value={s.name}>{s.name}</MenuItem>
                    ))}
                  </Select>
                )}
              </FormControl>
            </Box>

            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 3
            }}>
              <FormControl required>
                <InputLabel>{t('time') || 'Time'}</InputLabel>
                <Select 
                  name="time" 
                  value={formData.time} 
                  onChange={handleChange}
                  label={t('time') || 'Time'}
                >
                  <MenuItem value={1}>{t('morning') || 'Morning'}</MenuItem>
                  <MenuItem value={2}>{t('evening') || 'Evening'}</MenuItem>
                </Select>
              </FormControl>

              <FormControl required>
                <InputLabel>{t('animalType') || 'Animal Type'}</InputLabel>
                <Select 
                  name="animalType" 
                  value={formData.animalType} 
                  onChange={handleChange}
                  label={t('animalType') || 'Animal Type'}
                >
                  <MenuItem value={1}>{t('cow') || 'Cow'}</MenuItem>
                  <MenuItem value={2}>{t('buffalo') || 'Buffalo'}</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 3
            }}>
              <TextField 
                label={t('liters') || 'Liters'} 
                name="liters" 
                type="number" 
                value={formData.liters} 
                onChange={handleChange} 
                required 
                inputProps={{ min: 0, step: 'any' }}
              />
              <TextField 
                label={t('fat') || 'Fat'} 
                name="fat" 
                type="number" 
                value={formData.fat} 
                onChange={handleChange} 
                required 
                inputProps={{ min: 0, step: 'any' }}
              />
              <TextField 
                label={t('clr') || 'CLR'} 
                name="clr" 
                type="number" 
                value={formData.clr} 
                onChange={handleChange} 
                required 
                inputProps={{ min: 0, step: 'any' }}
              />
              <TextField 
                label={t('snf') || 'SNF'} 
                name="snf" 
                type="number" 
                value={formData.snf} 
                onChange={handleChange} 
                required 
                inputProps={{ min: 0, step: 'any' }}
              />
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mt: 4,
            justifyContent: 'flex-end'
          }}>
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={onClose}
            >
              {t('cancel') || 'Cancel'}
            </Button>
            <Button 
              variant="outlined"
              onClick={handleReset}
            >
              {t('reset') || 'Reset'}
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isSubmitting}
            >
              {isSubmitting ? t('submitting') || 'Submitting...' : t('submit') || 'Submit'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}