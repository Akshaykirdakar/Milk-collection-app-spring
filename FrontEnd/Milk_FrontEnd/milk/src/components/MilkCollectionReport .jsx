import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fade,
  CircularProgress,
  Alert,
  Stack,
  useTheme
} from '@mui/material';
import { Print, GetApp, Refresh } from '@mui/icons-material';

// Helper: Calculate totals and average
const safeExportText = (value) => String(value ?? "").normalize("NFC");

const calculateTotals = (collections) => {
  let morningL=0, morningA=0, eveningL=0, eveningA=0;
  collections.forEach(c => {
    morningL += parseFloat(c.morning.litre || 0);
    morningA += parseFloat(c.morning.amount || 0);
    eveningL += parseFloat(c.evening.litre || 0);
    eveningA += parseFloat(c.evening.amount || 0);
  });
  const grandL = morningL + eveningL;
  const grandA = morningA + eveningA;
  return {
    morning: { litre: morningL.toFixed(2), amount: morningA.toFixed(2) },
    evening: { litre: eveningL.toFixed(2), amount: eveningA.toFixed(2) },
    grand: { litre: grandL.toFixed(2), amount: grandA.toFixed(2) },
    averageRate: grandL ? (grandA / grandL).toFixed(2) : "0.00"
  };
};

// Transform raw API/CSV data to per-member collection
const transformData = (rows) => {
  const grouped = {};
  rows.forEach(r => {
    const memberName = r.supplier_name || r[7] || "Unknown";
    const memberCode = r.userid || r[8] || "1";
    const date = r.date || r[0];
    const time = parseInt(r.time || r[1]); // 1 = morning, 2 = evening
    const litre = parseFloat(r.liters || r[2] || 0);
    const fat = parseFloat(r.fat || r[3] || 0);
    const clr = parseFloat(r.clr || r[4] || 0);
    const snf = parseFloat(r.snf || r[5] || 0);
    const rate = parseFloat(r.rate || r[6] || 0);
    const amount = (litre * rate).toFixed(2);

    if(!grouped[memberName]) grouped[memberName] = [];

    let collection = grouped[memberName].find(c => c.date === date);
    if(!collection) {
      collection = { date, morning: {}, evening: {}, memberName, memberCode };
      grouped[memberName].push(collection);
    }

    const milkObj = { litre, fat, clr, snf, rate, amount };
    if(time === 1) collection.morning = milkObj;
    if(time === 2) collection.evening = milkObj;
  });
  return grouped;
};

const MilkCollectionReport = ({ data }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  // Transform API/CSV data
  const groupedData = transformData(data);
  const members = Object.keys(groupedData).map(name => {
    const collections = groupedData[name];
    const totals = calculateTotals(collections);
    return {
      name,
      code: collections[0].memberCode,
      collections,
      totals,
      deductions: { doctorFee: "0.00", insurance: "0.00", electricity: "0.00", feed: "0.00", total: "0.00" }
    };
  });

  // Export Excel
  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    members.forEach(member => {
      const wsData = [
        [safeExportText("Milk Collection Report")],
        [safeExportText("Member:"), safeExportText(member.name), safeExportText("Code:"), safeExportText(member.code)],
        ["Date", "Shift", "Morning Litre", "Morning Fat", "Morning CLR", "Morning SNF", "Morning Rate", "Morning Amount",
         "Evening Litre", "Evening Fat", "Evening CLR", "Evening SNF", "Evening Rate", "Evening Amount"]
      ];
      member.collections.forEach(c => {
        wsData.push([
          c.date, "1",
          c.morning.litre || 0, c.morning.fat || 0, c.morning.clr || 0, c.morning.snf || 0, c.morning.rate || 0, c.morning.amount || 0,
          c.evening.litre || 0, c.evening.fat || 0, c.evening.clr || 0, c.evening.snf || 0, c.evening.rate || 0, c.evening.amount || 0
        ]);
      });
      const worksheet = XLSX.utils.aoa_to_sheet(wsData.map((row) => row.map((cell) => safeExportText(cell))));
      worksheet["!cols"] = [
        { wch: 14 }, { wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 14 },
        { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 14 }
      ];
      XLSX.utils.book_append_sheet(wb, worksheet, safeExportText(member.name).substring(0,20));
    });
    XLSX.writeFile(wb, "MilkCollectionReport.xlsx");
  };


  if(loading) return <CircularProgress />;

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', p: 3 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<GetApp />} 
          onClick={exportExcel}
          sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#2563eb' : '#1d9bf0' }}
        >
          Export Excel
        </Button>
      </Stack>
      
      {members.map((m, idx) => (
        <Paper 
          key={idx} 
          sx={{ 
            border: `1px solid ${theme.palette.divider}`, 
            margin: '20px 0', 
            padding: 2, 
            pageBreakAfter: 'always',
            backgroundColor: theme.palette.background.paper
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, color: theme.palette.text.primary, fontWeight: 'bold' }}>
            {m.name} (Code: {m.code})
          </Typography>
          
          <TableContainer>
            <Table sx={{ width: '100%', borderCollapse: 'collapse' }} size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#f0f9ff' }}>
                  <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Morning Litre</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Morning Fat</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Morning CLR</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Morning SNF</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Morning Rate</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Morning Amount</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Evening Litre</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Evening Fat</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Evening CLR</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Evening SNF</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Evening Rate</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Evening Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {m.collections.map((c, i) => (
                  <TableRow 
                    key={i}
                    sx={{ 
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#f8fafc' }
                    }}
                  >
                    <TableCell sx={{ color: theme.palette.text.primary }}>{c.date}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{c.morning.litre||0}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{c.morning.fat||0}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{c.morning.clr||0}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{c.morning.snf||0}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{c.morning.rate||0}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{c.morning.amount||0}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{c.evening.litre||0}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{c.evening.fat||0}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{c.evening.clr||0}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{c.evening.snf||0}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{c.evening.rate||0}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{c.evening.amount||0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ marginTop: 2, color: theme.palette.text.primary }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Totals: Morning: {m.totals.morning.amount}, Evening: {m.totals.evening.amount}, Grand: {m.totals.grand.amount}, Average Rate: {m.totals.averageRate}
            </Typography>
          </Box>
        </Paper>
      ))}
      
      <style>{`@media print { div { page-break-after: always; } }`}</style>
    </Box>
  );
};

export default MilkCollectionReport;
