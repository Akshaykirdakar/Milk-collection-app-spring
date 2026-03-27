import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Alert,
  Divider,
  Button,
  Stack,
  TextField,
  Collapse,
  IconButton
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import axios from 'axios';
import { API_URLS } from '../config/api';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const MilkRateChart = () => {
  const [rateGroups, setRateGroups] = useState([]);
  const [fatSearch, setFatSearch] = useState('');
  const [snfSearch, setSnfSearch] = useState('');
  const [fromDateFilter, setFromDateFilter] = useState('');
  const [toDateFilter, setToDateFilter] = useState('');
  const [expandedCharts, setExpandedCharts] = useState({});
  const chartRefs = useRef([]);
  const printTarget = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printTarget.current,
    documentTitle: 'Milk Rate Chart',
  });

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await axios.get(API_URLS.getMilkRates);
        const grouped = groupByDate(res.data);
        setRateGroups(grouped);
        chartRefs.current = grouped.map(() => React.createRef());
      } catch (error) {
        console.error('Failed to fetch milk rates', error);
      }
    };
    fetchRates();
  }, []);

  const groupByDate = (data) => {
    const map = {};
    data.forEach((item) => {
      const key = `${item.fromDate}_${item.toDate}`;
      if (!map[key]) {
        map[key] = {
          fromDate: item.fromDate,
          toDate: item.toDate,
          rates: [],
        };
      }
      map[key].rates.push(item);
    });
    return Object.values(map);
  };

  const getUniqueSNFs = (rates) => [...new Set(rates.map((r) => r.snf))].sort((a, b) => b - a);
  const getUniqueFATs = (rates) => [...new Set(rates.map((r) => r.fat))].sort((a, b) => a - b);
  const getRate = (rates, fat, snf) => rates.find((r) => r.fat === fat && r.snf === snf);
  const checkMatch = (rates, fat, snf) => rates.some((r) => r.fat === fat && r.snf === snf);

  const handleExportPDF = async (ref, fileName) => {
    const canvas = await html2canvas(ref.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 10, width, height);
    pdf.save(fileName);
  };

  const handleExportExcel = (group) => {
    const wsData = [];
    const fats = getUniqueFATs(group.rates);
    const snfs = getUniqueSNFs(group.rates);
    wsData.push(['FAT / SNF', ...snfs]);
    fats.forEach((fat) => {
      const row = [fat];
      snfs.forEach((snf) => {
        const rateObj = getRate(group.rates, fat, snf);
        row.push(rateObj ? rateObj.rate.toFixed(2) : '-');
      });
      wsData.push(row);
    });
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rates');
    const fileName = `MilkRate_${group.fromDate}_${group.toDate}.xlsx`;
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
  };

  const handleExportAllPDF = async () => {
    const pdf = new jsPDF('l', 'mm', 'a4');
    for (let i = 0; i < chartRefs.current.length; i++) {
      const ref = chartRefs.current[i];
      const canvas = await html2canvas(ref.current);
      const imgData = canvas.toDataURL('image/png');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      if (i !== 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 10, width, height);
    }
    pdf.save('All_Milk_Rate_Charts.pdf');
  };

  const toggleChart = (index) => {
    setExpandedCharts((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const filteredGroups = rateGroups.filter((group) => {
    const inDateRange =
      (!fromDateFilter || group.fromDate >= fromDateFilter) &&
      (!toDateFilter || group.toDate <= toDateFilter);

    const matchesFatSnf = !fatSearch && !snfSearch
      ? true
      : group.rates.some((r) =>
          (!fatSearch || r.fat === parseFloat(fatSearch)) &&
          (!snfSearch || r.snf === parseFloat(snfSearch))
        );

    return inDateRange && matchesFatSnf;
  });

  return (
    <Box className="milk-rate-container">
      <Typography variant="h5" mb={2} className="userlist-title">Milk Rate Chart (Date-wise)</Typography>
      <Stack direction="row" spacing={2} mb={2} flexWrap="wrap" className="filters">
        <TextField label="From Date" type="date" value={fromDateFilter} onChange={(e) => setFromDateFilter(e.target.value)} InputLabelProps={{ shrink: true }} className="userlist-search" />
        <TextField label="To Date" type="date" value={toDateFilter} onChange={(e) => setToDateFilter(e.target.value)} InputLabelProps={{ shrink: true }} className="userlist-search" />
        <TextField label="Search FAT" type="number" value={fatSearch} onChange={(e) => setFatSearch(e.target.value)} className="userlist-search" />
        <TextField label="Search SNF" type="number" value={snfSearch} onChange={(e) => setSnfSearch(e.target.value)} className="userlist-search" />
        <Button variant="contained" onClick={handleExportAllPDF} className="btn-export pdf">Download All Charts as PDF</Button>
        {fatSearch && snfSearch && (() => {
          // Find the first group and rate that matches the search
          let found = null;
          for (const group of filteredGroups) {
            const rateObj = group.rates.find(r => r.fat === parseFloat(fatSearch) && r.snf === parseFloat(snfSearch));
            if (rateObj) {
              found = { rate: rateObj.rate, fromDate: group.fromDate, toDate: group.toDate };
              break;
            }
          }
          return found ? (
            <Box ml={2} display="flex" alignItems="center" style={{ fontWeight: 600, color: '#1976d2', fontSize: '1.1rem' }}>
              Rate:&nbsp;<span style={{ color: '#2e7d32', fontWeight: 700 }}>{found.rate.toFixed(2)}</span>
              <span style={{ color: '#888', marginLeft: 8, fontSize: '0.95rem' }}>
                (from {found.fromDate} to {found.toDate})
              </span>
            </Box>
          ) : (
            <Box ml={2} display="flex" alignItems="center" style={{ fontWeight: 600, color: '#d32f2f', fontSize: '1.1rem' }}>
              No rate found for FAT {fatSearch} and SNF {snfSearch}
            </Box>
          );
        })()}
      </Stack>
      {filteredGroups.length === 0 ? (
        <Alert severity="info" className="no-results">No milk rate data available.</Alert>
      ) : (
        filteredGroups.map((group, index) => {
          const snfs = getUniqueSNFs(group.rates);
          const fats = getUniqueFATs(group.rates);
          // Ensure chartRefs.current[index] is a ref object
          if (!chartRefs.current[index]) chartRefs.current[index] = React.createRef();
          const ref = chartRefs.current[index];
          const fat = parseFloat(fatSearch);
          const snf = parseFloat(snfSearch);
          const hasMatch = checkMatch(group.rates, fat, snf);

          return (
            <Paper key={index} className="milk-chart-card" elevation={4} style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #f5faff 60%, #e3f2fd 100%)',
              boxShadow: '0 6px 24px rgba(25, 118, 210, 0.13)',
              marginBottom: 32,
              padding: 0,
              overflow: 'hidden',
              border: '1.5px solid #e3f2fd',
              transition: 'box-shadow 0.3s',
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" className="chart-header" style={{
                padding: '20px 28px',
                background: expandedCharts[index] ? '#e3f2fd' : 'transparent',
                borderBottom: '1.5px solid #e3f2fd',
                minHeight: 64,
              }}>
                <Box display="flex" alignItems="center" style={{ gap: 16 }}>
                  <Typography variant="h6" style={{ fontWeight: 700, color: '#1976d2', fontSize: '1.25rem', letterSpacing: 1, marginRight: 16, cursor: 'pointer' }} onClick={() => toggleChart(index)}>
                    Milk Rate Chart from {group.fromDate} to {group.toDate}
                  </Typography>
                  <IconButton size="small" onClick={() => toggleChart(index)}>
                    {expandedCharts[index] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                <Box className="action-buttons">
                  <Button variant="outlined" onClick={() => {
                    printTarget.current = ref.current;
                    handlePrint();
                  }} className="btn-export print">Print</Button>
                  <Button variant="contained" onClick={() => handleExportPDF(ref, `MilkRate_${group.fromDate}_${group.toDate}.pdf`)} className="btn-export pdf">Export PDF</Button>
                  <Button variant="outlined" onClick={() => handleExportExcel(group)} className="btn-export excel">Export Excel</Button>
                </Box>
              </Box>
              <Collapse in={!!expandedCharts[index]}>
                <div ref={ref} style={{ padding: '32px 24px 24px 24px', background: '#fff', borderRadius: '0 0 16px 16px' }}>
                  <Divider sx={{ my: 2 }} />
                  <Table size="small" className="userlist-table" style={{ borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(25, 118, 210, 0.04)' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ background: '#e3f2fd', color: '#1976d2', fontWeight: 700, fontSize: '1rem' }}><strong>FAT / SNF</strong></TableCell>
                        {snfs.map((snfVal) => (
                          <TableCell key={snfVal} align="center" style={{ background: '#e3f2fd', color: '#1976d2', fontWeight: 700, fontSize: '1rem' }}><strong>{snfVal}</strong></TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fats.map((fatVal) => (
                        <TableRow key={fatVal} className="clickable-row" style={{ transition: 'background 0.2s' }}>
                          <TableCell style={{ color: '#1976d2', fontWeight: 600, fontSize: '1rem' }}><strong>{fatVal}</strong></TableCell>
                          {snfs.map((snfVal) => {
                            const rateObj = getRate(group.rates, fatVal, snfVal);
                            const highlight = fat === fatVal && snf === snfVal;
                            return (
                              <TableCell key={`${fatVal}_${snfVal}`} align="center" style={highlight ? {
                                background: 'linear-gradient(90deg, #fffde7 0%, #ffe082 100%)',
                                fontWeight: 700,
                                color: '#b28704',
                                border: '2px solid #ffd600',
                                borderRadius: 6,
                                fontSize: '1.1rem',
                              } : { fontSize: '1.05rem' }}>
                                {rateObj ? rateObj.rate.toFixed(2) : '-'}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {fatSearch && snfSearch && !hasMatch && (
                  <Alert severity="warning" className="no-results" sx={{ mt: 2 }}>
                    No rate found for FAT {fatSearch} and SNF {snfSearch} in this date range.
                  </Alert>
                )}
              </Collapse>
            </Paper>
          );
        })
      )}
    </Box>
  );
};

export default MilkRateChart;
