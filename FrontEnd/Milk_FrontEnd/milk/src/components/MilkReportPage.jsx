import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  useTheme,
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PrintIcon from '@mui/icons-material/Print';
import { useTranslation } from 'react-i18next';
import MilkReport from './MilkReport';

const MilkReportPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [fromDate, setFromDate] = useState('2025-01-01');
  const [toDate, setToDate] = useState('2025-10-15');
  const [submitted, setSubmitted] = useState(false);

  const reportRef = useRef(null);

  const handleGenerateReport = () => {
    setSubmitted(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      <Box className="no-print">
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 2,
            maxWidth: 1200,
            mx: 'auto',
            mb: 3,
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.divider,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              mb: 4,
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {t('milkCollectionReport', 'Milk Collection Report')}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
              mb: 4,
              flexWrap: 'wrap',
            }}
          >
            <TextField
              label={t('fromDate', 'From Date')}
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ 
                minWidth: 200,
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

            <TextField
              label={t('toDate', 'To Date')}
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ 
                minWidth: 200,
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

            <Button
              variant="contained"
              onClick={handleGenerateReport}
              startIcon={<AssessmentIcon />}
              sx={{ 
                px: 3,
                backgroundColor: theme.palette.mode === 'dark' ? '#2563eb' : '#1d9bf0',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? '#1d4ed8' : '#1b87cc',
                }
              }}
            >
              {t('generateReport', 'Generate Report')}
            </Button>
          </Box>

          {submitted && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={handlePrint}
                startIcon={<PrintIcon />}
                sx={{
                  borderColor: theme.palette.mode === 'dark' ? '#60a5fa' : '#1d9bf0',
                  color: theme.palette.mode === 'dark' ? '#60a5fa' : '#1d9bf0',
                  '&:hover': {
                    borderColor: theme.palette.mode === 'dark' ? '#93c5fd' : '#0ea5e9',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(29, 155, 240, 0.1)',
                  }
                }}
              >
                {t('printReport', 'Print Report')}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>

      {submitted && (
        <Box
          ref={reportRef}
          className="print-content"
          sx={{
            bgcolor: theme.palette.background.paper,
            p: 3,
            position: 'relative',
            '@media print': {
              p: 0,
              m: 0,
              left: 0,
              right: 0,
              position: 'absolute',
              width: '100% !important',
              boxShadow: 'none',
              '& .MuiPaper-root': {
                boxShadow: 'none',
                width: '100%',
              },
              '& table': {
                width: '100% !important',
                maxWidth: 'none',
              },
            },
          }}
        >
          <MilkReport fromDate={fromDate} toDate={toDate} />
        </Box>
      )}
    </Box>
  );
};

export default MilkReportPage;
