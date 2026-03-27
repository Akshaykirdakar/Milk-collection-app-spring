import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import MilkReport from './MilkReport';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const MilkReportPage = () => {
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

  const handleDownloadPDF = () => {
    const input = reportRef.current;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('milk-report.pdf');
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Controls section - hidden during print */}
      <Box className="no-print">
        <Paper 
          elevation={0} 
          variant="outlined"
          sx={{ 
            p: 3,
            borderRadius: 2,
            maxWidth: 1200,
            mx: 'auto',
            mb: 3
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              textAlign: 'center', 
              mb: 4,
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            दूध संकलन अहवाल
          </Typography>

          <Box 
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
              mb: 4,
              flexWrap: 'wrap'
            }}
          >
            <TextField
              label="पासून तारीख"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 200 }}
            />

            <TextField
              label="पर्यंत तारीख"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 200 }}
            />

            <Button
              variant="contained"
              onClick={handleGenerateReport}
              startIcon={<AssessmentIcon />}
              sx={{ px: 3 }}
            >
              Generate Report
            </Button>
          </Box>

          {submitted && (
            <Box 
              sx={{ 
                display: 'flex',
                justifyContent: 'center',
                gap: 2
              }}
            >
              <Button
                variant="outlined"
                onClick={handlePrint}
                startIcon={<PrintIcon />}
              >
                Print Report
              </Button>
              <Button
                variant="outlined"
                onClick={handleDownloadPDF}
                startIcon={<PictureAsPdfOutlinedIcon />}
              >
                Download PDF
              </Button>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Report content - visible during print */}
      {submitted && (
        <Box 
          ref={reportRef}
          className="print-content"
          sx={{
            bgcolor: 'background.paper',
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
                width: '100%'
              },
              '& table': {
                width: '100% !important',
                maxWidth: 'none'
              }
            }
          }}
        >
          <MilkReport fromDate={fromDate} toDate={toDate} />
        </Box>
      )}
    </Box>
  );
};

export default MilkReportPage;
