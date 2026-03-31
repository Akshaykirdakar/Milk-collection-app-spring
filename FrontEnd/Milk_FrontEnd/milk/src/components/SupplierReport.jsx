import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
  Typography,
  Container,
  useTheme,
} from '@mui/material';
import './SupplierReport.css';

const SupplierReport = ({ report }) => {
  const theme = useTheme();
  const totalLiters = report.entries.reduce((sum, e) => sum + e.liters, 0);
  const totalAmount = report.entries.reduce((sum, e) => sum + e.totalAmount, 0);

  return (
    <Box sx={{ width: '100%', m: 0, p: 0 }}>
      <Box sx={{ fontFamily: "'Devanagari', 'Arial', sans-serif", mb: 3 }}>
        <Paper
          sx={{
            border: `2px solid ${theme.palette.divider}`,
            m: '20px auto',
            p: 3,
            width: '90%',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3, width: '100%' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              शिवामृत दूध संकलन केंद्र
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              गिरजणी (भावनगर) ता. माळशिरस, जि. सोलापूर
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              दूध बिल
            </Typography>
            <Typography variant="body2">
              सप्लायर: {report.supplierName} | युजर ID: {report.userId}
            </Typography>
          </Box>

          <Box sx={{ width: '100%', overflowX: 'auto', mt: 2 }}>
            <Table
              sx={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: theme.palette.background.paper,
                '& thead': {
                  backgroundColor: theme.palette.mode === 'dark' ? '#1e40af' : '#3498db',
                },
              }}
              size="small"
            >
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#1e40af' : '#3498db',
                  }}
                >
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', width: '15%' }}>
                    दिनांक
                  </TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', width: '12%' }}>
                    लिटर
                  </TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', width: '10%' }}>
                    फॅट
                  </TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', width: '10%' }}>
                    CLR
                  </TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', width: '10%' }}>
                    SNF
                  </TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', width: '18%' }}>
                    रेट
                  </TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', width: '25%' }}>
                    रक्कम
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.entries.map((entry, i) => (
                  <TableRow
                    key={i}
                    sx={{
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? (i % 2 === 0 ? '#0f1729' : '#1a2332')
                        : (i % 2 === 0 ? '#ffffff' : '#f8f9fa'),
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#f0f4f8',
                      },
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <TableCell sx={{ color: theme.palette.text.primary, textAlign: 'center' }}>
                      {entry.date}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary, textAlign: 'center' }}>
                      {entry.liters.toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary, textAlign: 'center' }}>
                      {entry.fat.toFixed(1)}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary, textAlign: 'center' }}>
                      {entry.clr}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary, textAlign: 'center' }}>
                      {entry.snf.toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary, textAlign: 'center' }}>
                      {entry.rate.toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary, textAlign: 'center' }}>
                      {entry.totalAmount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#f1f7fc',
                    borderTop: `2px solid ${theme.palette.mode === 'dark' ? '#1e40af' : '#3498db'}`,
                  }}
                >
                  <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold', textAlign: 'center' }}>
                    एकूण
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold', textAlign: 'center' }}>
                    {totalLiters.toFixed(2)}
                  </TableCell>
                  <TableCell colSpan={4} />
                  <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold', textAlign: 'center' }}>
                    {totalAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Box>
        </Paper>
      </Box>

      <Box
        sx={{
          mt: 3,
          textAlign: 'right',
          fontSize: '14px',
          color: theme.palette.text.primary,
          pr: 3,
        }}
      >
        <Typography variant="body2">सदर बिल संगणक प्रणालीद्वारे तयार करण्यात आले आहे।</Typography>
        <Typography variant="body2">सर्वसाधारण दर: {(totalAmount / totalLiters).toFixed(2)} ₹/लिटर</Typography>
      </Box>
    </Box>
  );
};

export default SupplierReport;
