import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_URLS } from '../config/api';

const GenerateMilkRates = () => {
  const { t } = useTranslation();
  const [slabGroups, setSlabGroups] = useState([]);
  const [messages, setMessages] = useState({});
  const [baseRates, setBaseRates] = useState({});

  useEffect(() => {
    const fetchSlabs = async () => {
      try {
        const res = await axios.get(API_URLS.getmilkrateSlabs); // ✅ Corrected key
        const grouped = groupByDateRange(res.data);
        setSlabGroups(grouped);
      } catch (err) {
        console.error('Failed to fetch slabs', err);
      }
    };
    fetchSlabs();
  }, []);

  const groupByDateRange = (data) => {
    const map = {};
    data.forEach((entry) => {
      const key = `${entry.fromDate}_${entry.toDate}`;
      if (!map[key]) {
        map[key] = {
          fromDate: entry.fromDate,
          toDate: entry.toDate,
          slabs: [],
        };
      }
      map[key].slabs.push(entry);
    });
    return Object.values(map);
  };

  const handleBaseRateChange = (key, value) => {
    setBaseRates((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async (group) => {
    const key = `${group.fromDate}_${group.toDate}`;
    const baseRate = baseRates[key];
    if (!baseRate) return;

    try {
      await axios.post(API_URLS.generateMilkRates, null, {
        params: {
          baseRate,
          fromDate: group.fromDate,
          toDate: group.toDate,
        },
      });
      setMessages((prev) => ({
        ...prev,
        [key]: { type: 'success', text: t('ratesGenerated') },
      }));
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [key]: { type: 'error', text: t('ratesGeneratedError') },
      }));
    }
  };

  return (
    <Box className="add-user-container">
      <Typography variant="h5" gutterBottom>{t('generateMilkRatesTitle')}</Typography>

      {slabGroups.length === 0 ? (
        <Alert severity="info">No rate slabs available</Alert>
      ) : (
        slabGroups.map((group, idx) => {
          const key = `${group.fromDate}_${group.toDate}`;
          return (
            <Paper key={idx} elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6">
                Slabs for {group.fromDate} to {group.toDate}
              </Typography>
              <Divider sx={{ my: 2 }} />
              {group.slabs.map((slab, i) => (
                <Box key={i} display="flex" gap={2} mb={1}>
                  <TextField label={t('type')} value={slab.type} disabled />
                  <TextField label={t('from')} value={slab.fromValue} disabled />
                  <TextField label={t('to')} value={slab.toValue} disabled />
                  <TextField label={t('ratePerStep')} value={slab.ratePerStep} disabled />
                </Box>
              ))}

              <Box display="flex" alignItems="center" gap={2} mt={2}>
                <TextField
                  label={t('baseRate')}
                  type="number"
                  value={baseRates[key] || ''}
                  onChange={(e) => handleBaseRateChange(key, e.target.value)}
                />
                <Button variant="contained" onClick={() => handleGenerate(group)}>{t('generate')}</Button>
              </Box>

              {messages[key] && (
                <Alert severity={messages[key].type} sx={{ mt: 2 }}>
                  {messages[key].text}
                </Alert>
              )}
            </Paper>
          );
        })
      )}
    </Box>
  );
};

export default GenerateMilkRates;
