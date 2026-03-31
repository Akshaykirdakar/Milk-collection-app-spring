import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Checkbox, 
  Button, 
  Stack,
  FormControl,
  InputLabel,
  useTheme 
} from '@mui/material';
import { SaveAs } from '@mui/icons-material';

export default function ReportSettings({ onSave }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [reportTitle, setReportTitle] = useState('Milk Collection Report');
  const [showTotal, setShowTotal] = useState(true);
  const [groupBy, setGroupBy] = useState('date');

  const handleSubmit = (e) => {
    e.preventDefault();
    const settings = {
      reportTitle,
      showTotal,
      groupBy,
    };
    onSave(settings);
  };

  return (
    <Paper 
      sx={{ 
        p: 3, 
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        maxWidth: 500
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          color: theme.palette.text.primary,
          fontWeight: 'bold'
        }}
      >
        {t('reportSetting')}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          label={t('reportHeading')}
          value={reportTitle}
          onChange={(e) => setReportTitle(e.target.value)}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: theme.palette.text.primary,
              '& fieldset': {
                borderColor: theme.palette.divider,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />

        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: theme.palette.text.primary }}>{t('groupBy')}</InputLabel>
          <Select 
            value={groupBy} 
            label={t('groupBy')}
            onChange={(e) => setGroupBy(e.target.value)}
            sx={{
              color: theme.palette.text.primary,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.divider,
              },
            }}
          >
            <MenuItem value="date">{t('date')}</MenuItem>
            <MenuItem value="shift">{t('shift')}</MenuItem>
            <MenuItem value="user">{t('users')}</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={showTotal}
              onChange={(e) => setShowTotal(e.target.checked)}
              sx={{
                color: theme.palette.text.primary,
              }}
            />
          }
          label={<Typography sx={{ color: theme.palette.text.primary }}>{t('showTotals')}</Typography>}
        />

        <Button 
          type="submit" 
          variant="contained" 
          startIcon={<SaveAs />}
          sx={{ 
            mt: 2,
            backgroundColor: theme.palette.mode === 'dark' ? '#2563eb' : '#1d9bf0',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? '#1d4ed8' : '#1b87cc',
            }
          }}
        >
          {t('saveSettings')}
        </Button>
      </Box>
    </Paper>
  );
}
