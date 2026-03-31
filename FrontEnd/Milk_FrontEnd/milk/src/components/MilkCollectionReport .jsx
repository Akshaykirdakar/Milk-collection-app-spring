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

  if(loading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={exportExcel}>Export Excel</button>
      {members.map((m, idx) => (
        <div key={idx} style={{ border:'1px solid #ccc', margin:'20px 0', padding:10, pageBreakAfter:'always' }}>
          <h2>{m.name} (Code: {m.code})</h2>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Morning Litre</th><th>Morning Fat</th><th>Morning CLR</th><th>Morning SNF</th><th>Morning Rate</th><th>Morning Amount</th>
                <th>Evening Litre</th><th>Evening Fat</th><th>Evening CLR</th><th>Evening SNF</th><th>Evening Rate</th><th>Evening Amount</th>
              </tr>
            </thead>
            <tbody>
              {m.collections.map((c,i) => (
                <tr key={i}>
                  <td>{c.date}</td>
                  <td>{c.morning.litre||0}</td><td>{c.morning.fat||0}</td><td>{c.morning.clr||0}</td><td>{c.morning.snf||0}</td><td>{c.morning.rate||0}</td><td>{c.morning.amount||0}</td>
                  <td>{c.evening.litre||0}</td><td>{c.evening.fat||0}</td><td>{c.evening.clr||0}</td><td>{c.evening.snf||0}</td><td>{c.evening.rate||0}</td><td>{c.evening.amount||0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop:10 }}>
            <b>Totals: </b> Morning: {m.totals.morning.amount}, Evening: {m.totals.evening.amount}, Grand: {m.totals.grand.amount}, Average Rate: {m.totals.averageRate}
          </div>
        </div>
      ))}
      <style>{`@media print { div { page-break-after: always; } }`}</style>
    </div>
  );
};

export default MilkCollectionReport;
