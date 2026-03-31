import React from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import { useTranslation } from 'react-i18next';

export default function DataExportToolbar({
  onExcel,
  onPDF,
  onPrint,
  className = 'no-print',
  sx = {},
}) {
  const { t } = useTranslation();

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1,
        flexWrap: 'wrap',
        ...sx,
      }}
    >
      <Tooltip title={t('exportExcel', 'Export Excel')}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FileDownloadOutlinedIcon />}
          onClick={onExcel}
          sx={{ textTransform: 'none' }}
        >
          {t('exportExcel', 'Export Excel')}
        </Button>
      </Tooltip>
      <Tooltip title={t('exportPDF', 'Export PDF')}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<PictureAsPdfOutlinedIcon />}
          onClick={onPDF}
          sx={{ textTransform: 'none' }}
        >
          {t('exportPDF', 'Export PDF')}
        </Button>
      </Tooltip>
      <Tooltip title={t('print', 'Print')}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<PrintOutlinedIcon />}
          onClick={onPrint}
          sx={{ textTransform: 'none' }}
        >
          {t('print', 'Print')}
        </Button>
      </Tooltip>
    </Box>
  );
}
