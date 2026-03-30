import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import { API_URLS } from '../config/api';
import { useTranslation } from 'react-i18next';
import SupplierReport from './SupplierReport';
import DataExportToolbar from './DataExportToolbar';
import { exportToExcel, exportToPDF, handlePrint } from '../utils/exportUtils';

const MilkReport = ({ fromDate, toDate }) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fromDate || !toDate) return;

    setLoading(true);
    axios
      .get(API_URLS.getMilkCollectionsDateWise, {
        params: { fromDate, toDate },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error('API call error:', err))
      .finally(() => setLoading(false));
  }, [fromDate, toDate]);

  if (loading) return <div>{t('loading', 'Loading...')}</div>;
  if (!data || data.length === 0) return <div>{t('noDataAvailable', 'No data available.')}</div>;

  const exportRows = data.flatMap((report) =>
    (report.entries || []).map((entry) => ({
      supplierName: report.supplierName,
      userId: report.userId,
      date: entry.date,
      liters: entry.liters,
      fat: entry.fat,
      clr: entry.clr,
      snf: entry.snf,
      rate: entry.rate,
      totalAmount: entry.totalAmount,
    }))
  );

  const exportColumns = [
    { key: 'supplierName', header: t('supplierName', 'Supplier Name') },
    { key: 'userId', header: t('userId', 'Supplier ID') },
    { key: 'date', header: t('date', 'Date'), type: 'date' },
    { key: 'liters', header: t('liters', 'Liters'), type: 'number' },
    { key: 'fat', header: t('fat', 'Fat'), type: 'number' },
    { key: 'clr', header: t('clr', 'CLR'), type: 'number' },
    { key: 'snf', header: t('snf', 'SNF'), type: 'number' },
    { key: 'rate', header: t('rate', 'Rate'), type: 'number' },
    { key: 'totalAmount', header: 'Amount', type: 'number' },
  ];

  const summary = [
    { label: t('fromDate', 'From Date'), value: fromDate },
    { label: t('toDate', 'To Date'), value: toDate },
    { label: t('totalSuppliers', 'Total Suppliers'), value: data.length },
    {
      label: 'Total Liters',
      value: exportRows.reduce((sum, row) => sum + (Number(row.liters) || 0), 0).toFixed(2),
    },
    {
      label: 'Total Amount',
      value: exportRows
        .reduce((sum, row) => sum + (Number(row.totalAmount) || 0), 0)
        .toFixed(2),
    },
  ];

  return (
    <div className="milk-report-wrapper" style={{ width: '100%' }}>
      <Box className="no-print" sx={{ mb: 2 }}>
        <DataExportToolbar
          onExcel={() =>
            exportToExcel({
              data: exportRows,
              columns: exportColumns,
              fileBaseName: 'MilkCollectionReport',
              sheetName: 'MilkReport',
            })
          }
          onPDF={() =>
            exportToPDF({
              data: exportRows,
              columns: exportColumns,
              title: t('milkCollectionReport', 'Milk Collection Report'),
              fileBaseName: 'MilkCollectionReport',
              summary,
            })
          }
          onPrint={() =>
            handlePrint({
              data: exportRows,
              columns: exportColumns,
              title: t('milkCollectionReport', 'Milk Collection Report'),
              summary,
            })
          }
        />
      </Box>

      {data.map((report, idx) => (
        <div
          className="report-container"
          key={idx}
          style={{
            width: '100%',
            pageBreakAfter: 'always',
          }}
        >
          <SupplierReport report={report} fromDate={fromDate} toDate={toDate} />
        </div>
      ))}
    </div>
  );
};

export default MilkReport;
