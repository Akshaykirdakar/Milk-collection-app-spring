import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Select, MenuItem, FormControl,
  InputLabel, Typography, Box, IconButton, Alert, Grid, Divider
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import axios from 'axios';
import { API_URLS } from '../config/api';
import { useTranslation } from 'react-i18next';
import {
  PageContainer,
  PageHeader,
  SectionCard,
} from './UIComponents';
import DataExportToolbar from './DataExportToolbar';
import { exportToExcel, exportToPDF, handlePrint } from '../utils/exportUtils';

const MilkRateSlabs = () => {
  const { t } = useTranslation();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [slabs, setSlabs] = useState([]);
  const [type, setType] = useState('FAT');
  const [tempSlab, setTempSlab] = useState({ fromValue: '', toValue: '', ratePerStep: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSlabs();
  }, []);

  const fetchSlabs = async () => {
    try {
      const res = await axios.get(`${API_URLS.getmilkrateSlabs}`);
      setSlabs(res.data.slabs || []);
    } catch (err) {
      setMessage({
        type: 'error',
        text: t('fetchSlabsFailed', 'Unable to load the existing rate slabs.'),
      });
    }
  };

  const handleTempChange = (e) => {
    const { name, value } = e.target;
    setTempSlab((prev) => ({ ...prev, [name]: value }));
  };

  const addSlab = () => {
    const { fromValue, toValue, ratePerStep } = tempSlab;
    if (fromValue && toValue && ratePerStep) {
      setSlabs([...slabs, {
        type,
        fromValue: parseFloat(fromValue),
        toValue: parseFloat(toValue),
        ratePerStep: parseFloat(ratePerStep),
      }]);
      setTempSlab({ fromValue: '', toValue: '', ratePerStep: '' });
    }
  };

  const removeSlab = (index) => setSlabs(slabs.filter((_, i) => i !== index));
  const exportColumns = [
    { key: 'type', header: t('type', 'Type') },
    { key: 'fromValue', header: t('fromValue', 'From Value'), type: 'number' },
    { key: 'toValue', header: t('toValue', 'To Value'), type: 'number' },
    { key: 'ratePerStep', header: t('ratePerStep', 'Rate per Step'), type: 'number' },
  ];

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_URLS.addMilkRateSlabs}`, {
        fromDate,
        toDate,
        slabs,
      });
      setMessage({
        type: 'success',
        text: t('submitSlabsSuccess', 'Rate slabs saved successfully.'),
      });
      setFromDate('');
      setToDate('');
      setTempSlab({ fromValue: '', toValue: '', ratePerStep: '' });
      fetchSlabs();
    } catch (err) {
      setMessage({
        type: 'error',
        text: t('submitSlabsFailed', 'Unable to save the rate slabs. Please try again.'),
      });
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        title={t('rateSlabsTitle', 'Milk Rate Slabs')}
        subtitle={t('rateSlabsSubtitle', 'Create and manage milk rate configurations.')}
      />

      {/* Alert Messages */}
      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      {/* Main Form Section */}
      <SectionCard title={t('addRateConfiguration', 'Add New Rate Configuration')}>
        <Grid container spacing={2}>
          {/* Date Range Row */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label={t('fromDate', 'From Date')}
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d5d5d5',
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label={t('toDate', 'To Date')}
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d5d5d5',
                },
              }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Add Slab Section */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            fontSize: '0.9rem',
            color: '#1a1a1a',
            mb: 2,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {t('addNewSlab', 'Add New Slab')}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('type', 'Type')}</InputLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                label={t('type', 'Type')}
                sx={{
                  fontSize: '0.875rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d5d5d5',
                  },
                }}
              >
                <MenuItem value="FAT">FAT</MenuItem>
                <MenuItem value="SNF">SNF</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              label={t('fromValue', 'From Value')}
              name="fromValue"
              type="number"
              value={tempSlab.fromValue}
              onChange={handleTempChange}
              size="small"
              inputProps={{ step: 'any', min: 0 }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d5d5d5',
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              label={t('toValue', 'To Value')}
              name="toValue"
              type="number"
              value={tempSlab.toValue}
              onChange={handleTempChange}
              size="small"
              inputProps={{ step: 'any', min: 0 }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d5d5d5',
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              label={t('ratePerStep', 'Rate per Step')}
              name="ratePerStep"
              type="number"
              value={tempSlab.ratePerStep}
              onChange={handleTempChange}
              size="small"
              inputProps={{ step: 'any', min: 0 }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d5d5d5',
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 1 }} sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <IconButton
              color="primary"
              onClick={addSlab}
              sx={{
                width: '100%',
                height: '40px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #d5d5d5',
                borderRadius: '6px',
                '&:hover': {
                  backgroundColor: '#e8e8e8',
                },
              }}
            >
              <Add />
            </IconButton>
          </Grid>
        </Grid>
      </SectionCard>

      {/* Existing Slabs Section */}
      {slabs.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <SectionCard title={`${t('addedSlabs', 'Configured Slabs')} (${slabs.length})`}>
            <DataExportToolbar
              onExcel={() =>
                exportToExcel({
                  data: slabs,
                  columns: exportColumns,
                  fileBaseName: 'MilkRateSlabs',
                  sheetName: 'RateSlabs',
                })
              }
              onPDF={() =>
                exportToPDF({
                  data: slabs,
                  columns: exportColumns,
                  title: t('rateSlabsTitle', 'Milk Rate Slabs'),
                  fileBaseName: 'MilkRateSlabs',
                  summary: [
                    { label: 'From Date', value: fromDate || '-' },
                    { label: 'To Date', value: toDate || '-' },
                    { label: 'Slabs', value: slabs.length },
                  ],
                })
              }
              onPrint={() =>
                handlePrint({
                  data: slabs,
                  columns: exportColumns,
                  title: t('rateSlabsTitle', 'Milk Rate Slabs'),
                  summary: [
                    { label: 'From Date', value: fromDate || '-' },
                    { label: 'To Date', value: toDate || '-' },
                    { label: 'Slabs', value: slabs.length },
                  ],
                })
              }
              sx={{ mb: 2 }}
            />
            <Box sx={{ overflowX: 'auto' }}>
              <Grid container spacing={1.5} sx={{ minWidth: '100%' }}>
                {slabs.map((slab, index) => (
                  <Grid size={12} key={index}>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: 'auto 1fr auto', sm: '80px 100px 100px 120px auto' },
                        gap: 1,
                        alignItems: 'center',
                        p: 1.5,
                        backgroundColor: '#f8f9fa',
                        borderRadius: '6px',
                        border: '1px solid #e0e0e0',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: '#1976d2',
                          textTransform: 'uppercase',
                        }}
                      >
                        {slab.type}
                      </Typography>

                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {slab.fromValue} - {slab.toValue}
                      </Typography>

                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                        ${slab.ratePerStep}
                      </Typography>

                      <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeSlab(index)}
                        sx={{
                          border: '1px solid #f5a5a5',
                          backgroundColor: '#ffe8e8',
                          '&:hover': {
                            backgroundColor: '#ffcdd2',
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </SectionCard>
        </Box>
      )}

      {/* Submit Section */}
      <Box sx={{ mt: 4, mb: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          sx={{
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {t('cancel', 'Cancel')}
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!fromDate || !toDate || slabs.length === 0}
          sx={{
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            px: 3,
          }}
        >
          {t('submitRateSlabs', 'Save Rate Slabs')}
        </Button>
      </Box>
    </PageContainer>
  );
};

export default MilkRateSlabs;
