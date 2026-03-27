import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Select, MenuItem, FormControl,
  InputLabel, Typography, Box, IconButton, Alert, Paper
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import axios from 'axios';
import { API_URLS } from '../config/api'; // Adjust based on your actual config path
import '../App.css';

const MilkRateSlabs = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [slabs, setSlabs] = useState([]);
  const [type, setType] = useState('FAT');
  const [tempSlab, setTempSlab] = useState({ fromValue: '', toValue: '', ratePerStep: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  // ✅ Load existing slabs on mount
  useEffect(() => {
    fetchSlabs();
  }, []);

  const fetchSlabs = async () => {
    try {
      const res = await axios.get(`${API_URLS.getmilkrateSlabs}`); // Example: '/api/rates/slabs'
      setSlabs(res.data.slabs || []); // Adjust based on your API structure
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load existing rate slabs.' });
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

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_URLS.addMilkRateSlabs}`, {
        fromDate,
        toDate,
        slabs,
      });
      setMessage({ type: 'success', text: 'Rate slabs submitted successfully!' });
      setFromDate('');
      setToDate('');
      setTempSlab({ fromValue: '', toValue: '', ratePerStep: '' });
      fetchSlabs(); // Reload after submitting
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to submit slabs. Please try again.' });
    }
  };

  return (
    <Box className="add-user-container">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" mb={2}>Add Milk Rate Slabs</Typography>

        {message.text && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

        {/* Date Range */}
        <Box display="flex" gap={2} mb={3}>
          <TextField
            label="From Date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="To Date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        {/* Add Slab Input Row */}
        <Box display="flex" gap={2} mb={2} alignItems="center">
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)} label="Type">
              <MenuItem value="FAT">FAT</MenuItem>
              <MenuItem value="SNF">SNF</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="From Value"
            name="fromValue"
            type="number"
            value={tempSlab.fromValue}
            onChange={handleTempChange}
            fullWidth
          />
          <TextField
            label="To Value"
            name="toValue"
            type="number"
            value={tempSlab.toValue}
            onChange={handleTempChange}
            fullWidth
          />
          <TextField
            label="Rate/Step"
            name="ratePerStep"
            type="number"
            value={tempSlab.ratePerStep}
            onChange={handleTempChange}
            fullWidth
          />
          <IconButton color="primary" onClick={addSlab}>
            <Add />
          </IconButton>
        </Box>

        {/* Slab List */}
        {slabs.length > 0 && (
          <Box mb={3}>
            <Typography variant="subtitle1">Added Slabs:</Typography>
            {slabs.map((slab, index) => (
              <Box key={index} display="flex" gap={2} alignItems="center" mt={1}>
                <TextField label="Type" value={slab.type} disabled />
                <TextField label="From" value={slab.fromValue} disabled />
                <TextField label="To" value={slab.toValue} disabled />
                <TextField label="Rate/Step" value={slab.ratePerStep} disabled />
                <IconButton color="error" onClick={() => removeSlab(index)}>
                  <Delete />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!fromDate || !toDate || slabs.length === 0}
        >
          Submit All Slabs
        </Button>
      </Paper>
    </Box>
  );
};

export default MilkRateSlabs;
