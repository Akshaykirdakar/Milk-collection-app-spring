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
  Stack,
  TextField,
  Collapse,
  IconButton
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import axios from 'axios';
import { API_URLS } from '../config/api';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DataExportToolbar from './DataExportToolbar';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import { PageHeader, SectionCard } from './UIComponents';

const MilkRateChart = () => {
  const { t } = useTranslation();
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
    documentTitle: t('milkRateChartDateWise', 'Milk Rate Chart'),
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
  const flattenedRateRows = filteredGroups.flatMap((group) =>
    group.rates.map((rate) => ({
      fromDate: group.fromDate,
      toDate: group.toDate,
      fat: rate.fat,
      snf: rate.snf,
      rate: rate.rate,
    }))
  );
  const allRateColumns = [
    { key: 'fromDate', header: t('fromDate', 'From Date'), type: 'date' },
    { key: 'toDate', header: t('toDate', 'To Date'), type: 'date' },
    { key: 'fat', header: 'FAT', type: 'number' },
    { key: 'snf', header: 'SNF', type: 'number' },
    { key: 'rate', header: t('rate', 'Rate'), type: 'number' },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <PageHeader
        title={t('milkRateChartDateWise', 'Milk Rate Chart')}
        subtitle={t('reviewAndExport')}
        sx={{ mb: 0 }}
      />
      <SectionCard
        noPadding
        sx={{ p: 2.5 }}
      >
      <Stack direction="row" spacing={2} mb={0} flexWrap="wrap">
        <TextField label={t('fromDate')} type="date" value={fromDateFilter} onChange={(e) => setFromDateFilter(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label={t('toDate')} type="date" value={toDateFilter} onChange={(e) => setToDateFilter(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label={t('searchFat')} type="number" value={fatSearch} onChange={(e) => setFatSearch(e.target.value)} />
        <TextField label={t('searchSnf')} type="number" value={snfSearch} onChange={(e) => setSnfSearch(e.target.value)} />
        <DataExportToolbar
          onExcel={() =>
            exportToExcel({
              data: flattenedRateRows,
              columns: allRateColumns,
              fileBaseName: 'MilkRateChart',
              sheetName: 'MilkRates',
            })
          }
          onPDF={() =>
            exportToPDF({
              data: flattenedRateRows,
              columns: allRateColumns,
              title: t('milkRateChartDateWise', 'Milk Rate Chart'),
              fileBaseName: 'MilkRateChart',
              summary: [{ label: t('rateRows', 'Rate Rows'), value: flattenedRateRows.length }],
            })
          }
          onPrint={() => window.print()}
          sx={{ ml: 'auto' }}
        />
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
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', fontWeight: 600, color: 'primary.main', fontSize: '1.1rem' }}>
              Rate:&nbsp;<Box component="span" sx={{ color: 'success.main', fontWeight: 700 }}>{found.rate.toFixed(2)}</Box>
              <Box component="span" sx={{ color: 'text.secondary', ml: 1, fontSize: '0.95rem' }}>
                ({t('rateAvailableRange', 'Effective from {{fromDate}} to {{toDate}}', {
                  fromDate: found.fromDate,
                  toDate: found.toDate,
                })})
              </Box>
            </Box>
          ) : (
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', fontWeight: 600, color: 'error.main', fontSize: '1.1rem' }}>
              {t('noRateFound', 'No rate found for the selected FAT and SNF values.')}
            </Box>
          );
        })()}
      </Stack>
      </SectionCard>
      {filteredGroups.length === 0 ? (
        <Alert severity="info">
          {t('noMilkRateData', 'No milk rate data available.')}
        </Alert>
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
            <SectionCard key={index} noPadding sx={{ mb: 4, overflow: 'hidden' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 3,
                  backgroundColor: expandedCharts[index] ? 'rgba(37,99,235,0.06)' : '#ffffff',
                  borderBottom: '1px solid #e6e6e6',
                  minHeight: 64,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1.1rem', cursor: 'pointer' }}
                    onClick={() => toggleChart(index)}
                  >
                    {t('milkRateChartForRange', 'Milk Rate Chart from {{fromDate}} to {{toDate}}', {
                      fromDate: group.fromDate,
                      toDate: group.toDate,
                    })}
                  </Typography>
                  <IconButton size="small" onClick={() => toggleChart(index)}>
                    {expandedCharts[index] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                <Box>
                  <DataExportToolbar
                    onPrint={() => {
                      printTarget.current = ref.current;
                      handlePrint();
                    }}
                    onPDF={() => handleExportPDF(ref, `MilkRate_${group.fromDate}_${group.toDate}.pdf`)}
                    onExcel={() =>
                      exportToExcel({
                        data: group.rates,
                        columns: [
                          { key: 'fromDate', header: t('fromDate', 'From Date'), type: 'date', getValue: () => group.fromDate },
                          { key: 'toDate', header: t('toDate', 'To Date'), type: 'date', getValue: () => group.toDate },
                          { key: 'fat', header: 'FAT', type: 'number' },
                          { key: 'snf', header: 'SNF', type: 'number' },
                          { key: 'rate', header: t('rate', 'Rate'), type: 'number' },
                        ],
                        fileBaseName: `MilkRate_${group.fromDate}_${group.toDate}`,
                        sheetName: 'Rates',
                      })
                    }
                  />
                </Box>
              </Box>
              <Collapse in={!!expandedCharts[index]}>
                <Box ref={ref} sx={{ p: 3, backgroundColor: '#ffffff' }}>
                  <Divider sx={{ my: 2 }} />
                  <Table size="small" sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ backgroundColor: 'rgba(37,99,235,0.08)', color: 'primary.main', fontWeight: 700, fontSize: '1rem' }}><strong>FAT / SNF</strong></TableCell>
                        {snfs.map((snfVal) => (
                          <TableCell key={snfVal} align="center" sx={{ backgroundColor: 'rgba(37,99,235,0.08)', color: 'primary.main', fontWeight: 700, fontSize: '1rem' }}><strong>{snfVal}</strong></TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fats.map((fatVal) => (
                        <TableRow key={fatVal}>
                          <TableCell sx={{ color: 'primary.main', fontWeight: 600, fontSize: '1rem' }}><strong>{fatVal}</strong></TableCell>
                          {snfs.map((snfVal) => {
                            const rateObj = getRate(group.rates, fatVal, snfVal);
                            const highlight = fat === fatVal && snf === snfVal;
                            return (
                              <TableCell
                                key={`${fatVal}_${snfVal}`}
                                align="center"
                                sx={
                                  highlight
                                    ? {
                                        backgroundColor: 'rgba(245,158,11,0.14)',
                                        fontWeight: 700,
                                        color: 'warning.dark',
                                        boxShadow: 'inset 0 0 0 1px rgba(245,158,11,0.35)',
                                        borderRadius: '8px',
                                        fontSize: '1.1rem',
                                      }
                                    : { fontSize: '1.05rem' }
                                }
                              >
                                {rateObj ? rateObj.rate.toFixed(2) : '-'}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
                {fatSearch && snfSearch && !hasMatch && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    {t('noRateFound', 'No rate found for the selected FAT and SNF values.')}
                  </Alert>
                )}
              </Collapse>
            </SectionCard>
          );
        })
      )}
    </Box>
  );
};

export default MilkRateChart;
