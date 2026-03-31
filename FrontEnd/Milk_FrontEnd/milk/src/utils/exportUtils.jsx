import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, parseISO } from 'date-fns';
import { enUS, hi } from 'date-fns/locale';
import i18n from '../i18n';

const PAD = (value) => String(value).padStart(2, '0');
const PDF_FONT_FILE_MANGAL = 'Mangal.ttf';
const PDF_FONT_FILE_NOTO = 'NotoSansMr-Regular.ttf';
const PDF_FONT_NAME_MANGAL = 'Mangal';
const PDF_FONT_NAME_NOTO = 'NotoSansMr';
const PRINT_FONT_STACK = '"Mangal", "Nirmala UI", "Aparajita", "Noto Sans Devanagari", Arial, sans-serif';

let pdfFontBase64PromiseMangal;
let pdfFontBase64PromiseNoto;

// Get date-fns locale based on i18n language
const getDateFnsLocale = () => {
  const lang = i18n.language || 'en';
  if (lang === 'mr') return hi; // Use Hindi locale for Marathi (date-fns doesn't have Marathi)
  return enUS;
};

const sanitizeExportValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value;
  }

  return String(value).normalize('NFC');
};

const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = '';

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return window.btoa(binary);
};

// Load Mangal font (fallback)
const loadPdfFontBase64Mangal = async () => {
  if (!pdfFontBase64PromiseMangal) {
    const fontUrl = `${process.env.PUBLIC_URL || ''}/fonts/Mangal.ttf`;
    pdfFontBase64PromiseMangal = fetch(fontUrl)
      .then((response) => {
        if (!response.ok) {
          console.warn(`Mangal font not found at ${fontUrl}, will use Noto Sans`);
          return null;
        }
        return response.arrayBuffer();
      })
      .then((buffer) => buffer ? arrayBufferToBase64(buffer) : null)
      .catch((err) => {
        console.warn('Error loading Mangal font:', err);
        return null;
      });
  }

  return pdfFontBase64PromiseMangal;
};

// Load Noto Sans Marathi font (primary)
const loadPdfFontBase64Noto = async () => {
  if (!pdfFontBase64PromiseNoto) {
    const fontUrl = `${process.env.PUBLIC_URL || ''}/fonts/NotoSansMr-Regular.ttf`;
    pdfFontBase64PromiseNoto = fetch(fontUrl)
      .then((response) => {
        if (!response.ok) {
          console.warn(`Noto Sans Marathi font not found at ${fontUrl}`);
          return null;
        }
        return response.arrayBuffer();
      })
      .then((buffer) => buffer ? arrayBufferToBase64(buffer) : null)
      .catch((err) => {
        console.warn('Error loading Noto Sans Marathi font:', err);
        return null;
      });
  }

  return pdfFontBase64PromiseNoto;
};

// Register Unicode fonts with fallback chain
const registerUnicodeFonts = async (doc) => {
  try {
    // Try Noto Sans first (primary font for Marathi)
    const notoBase64 = await loadPdfFontBase64Noto();
    if (notoBase64) {
      doc.addFileToVFS(PDF_FONT_FILE_NOTO, notoBase64);
      doc.addFont(PDF_FONT_FILE_NOTO, PDF_FONT_NAME_NOTO, 'normal');
      doc.setFont(PDF_FONT_NAME_NOTO, 'normal');
      return PDF_FONT_NAME_NOTO;
    }

    // Fallback to Mangal
    const mangalBase64 = await loadPdfFontBase64Mangal();
    if (mangalBase64) {
      doc.addFileToVFS(PDF_FONT_FILE_MANGAL, mangalBase64);
      doc.addFont(PDF_FONT_FILE_MANGAL, PDF_FONT_NAME_MANGAL, 'normal');
      doc.setFont(PDF_FONT_NAME_MANGAL, 'normal');
      return PDF_FONT_NAME_MANGAL;
    }

    // If no fonts found, use default (will work for English)
    console.warn('Neither Noto Sans Marathi nor Mangal font found, using default');
    return 'helvetica';
  } catch (error) {
    console.error('Error registering fonts:', error);
    return 'helvetica';
  }
};

// i18n-aware date formatting
export const formatDateForDisplay = (value, language = null) => {
  if (!value) return '';

  try {
    const normalized = typeof value === 'string' ? value.trim() : value;
    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) {
      return sanitizeExportValue(value);
    }

    const lang = language || i18n.language || 'en';
    const locale = lang === 'mr' ? mr : enUS;
    
    // Format: DD-MM-YYYY
    return format(date, 'dd-MM-yyyy', { locale });
  } catch (error) {
    console.error('Error formatting date:', error);
    return sanitizeExportValue(value);
  }
};

// i18n-aware datetime formatting
export const formatDateTimeForDisplay = (value = new Date(), language = null) => {
  try {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const lang = language || i18n.language || 'en';
    const locale = lang === 'mr' ? mr : enUS;

    // Format: DD-MM-YYYY HH:MM
    return format(date, 'dd-MM-yyyy HH:mm', { locale });
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '';
  }
};

// i18n-aware code value formatting
export const formatCodeValue = (field, value, language = null) => {
  const { t } = i18n;
  const lang = language || i18n.language || 'en';

  if (field === 'time') {
    if (Number(value) === 1) return lang === 'mr' ? 'सकाळ' : 'Morning';
    if (Number(value) === 2) return lang === 'mr' ? 'संध्याकाळ' : 'Evening';
  }

  if (field === 'animalType') {
    if (Number(value) === 1) return lang === 'mr' ? 'गाय' : 'Cow';
    if (Number(value) === 2) return lang === 'mr' ? 'म्हैस' : 'Buffalo';
  }

  return value;
};

export const formatValueByType = (value, type, field, language = null) => {
  const codeFormatted = formatCodeValue(field, value, language);

  if (codeFormatted === '' || codeFormatted === null || codeFormatted === undefined) {
    return '';
  }

  if (type === 'date') {
    return formatDateForDisplay(codeFormatted, language);
  }

  if (type === 'number') {
    const numericValue = Number(codeFormatted);
    return Number.isFinite(numericValue)
      ? numericValue.toFixed(2)
      : sanitizeExportValue(codeFormatted);
  }

  return sanitizeExportValue(codeFormatted);
};

export const buildExportFileName = (baseName, extension) => {
  const now = new Date();
  const stamp = `${now.getFullYear()}${PAD(now.getMonth() + 1)}${PAD(now.getDate())}`;
  return `${baseName}_${stamp}.${extension}`;
};

const normalizeColumns = (columns = []) =>
  columns
    .filter((column) => !column.disableExport)
    .map((column) => ({
      key: column.key,
      header: column.header,
      type: column.type || 'text',
      align: column.align || (column.type === 'number' ? 'right' : 'left'),
      getValue: column.getValue || ((row) => row?.[column.key]),
    }));

const normalizeRows = (rows = [], columns = [], language = null) =>
  rows.map((row) =>
    columns.map((column) => formatValueByType(column.getValue(row), column.type, column.key, language))
  );

const normalizeObjects = (rows = [], columns = [], language = null) =>
  rows.map((row) =>
    columns.reduce((accumulator, column) => {
      accumulator[column.header] = formatValueByType(
        column.getValue(row),
        column.type,
        column.key,
        language
      );
      return accumulator;
    }, {})
  );

const calculateColumnWidths = (headers, rows) =>
  headers.map((header, index) => {
    const rowLengths = rows.map((row) => String(row[index] ?? '').length);
    const maxLength = Math.max(header.length, ...rowLengths, 10);
    return { wch: Math.min(maxLength + 2, 30) };
  });

export const exportToExcel = ({ data = [], columns = [], fileBaseName = 'Export', sheetName = 'Report', language = null }) => {
  const lang = language || i18n.language || 'en';
  const normalizedColumns = normalizeColumns(columns);
  const headers = normalizedColumns.map((column) => sanitizeExportValue(column.header));
  const rows = normalizeRows(data, normalizedColumns, lang);
  const rowObjects = normalizeObjects(data, normalizedColumns, lang);
  const worksheet = XLSX.utils.json_to_sheet(rowObjects, {
    header: headers,
    skipHeader: false,
  });

  worksheet['!cols'] = calculateColumnWidths(headers, rows);
  worksheet['!autofilter'] = {
    ref: XLSX.utils.encode_range({
      s: { c: 0, r: 0 },
      e: { c: headers.length - 1, r: Math.max(rows.length, 1) },
    }),
  };

  normalizedColumns.forEach((column, columnIndex) => {
    rows.forEach((_, rowIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ c: columnIndex, r: rowIndex + 1 });
      const cell = worksheet[cellAddress];

      if (!cell) return;

      if (column.type === 'number') {
        const numericValue = Number(String(cell.v).replace(/,/g, ''));
        if (Number.isFinite(numericValue)) {
          cell.t = 'n';
          cell.v = numericValue;
          cell.z = '0.00';
        }
      }
    });
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, buildExportFileName(fileBaseName, 'xlsx'));
};

export const exportToPDF = async ({
  data = [],
  columns = [],
  title = 'Report',
  fileBaseName = 'Report',
  orientation = 'landscape',
  summary = [],
  language = null,
}) => {
  const lang = language || i18n.language || 'en';
  const normalizedColumns = normalizeColumns(columns);
  const headers = normalizedColumns.map((column) => sanitizeExportValue(column.header));
  const rows = normalizeRows(data, normalizedColumns, lang);
  
  const doc = new jsPDF({
    orientation,
    unit: 'pt',
    format: 'a4',
  });
  
  const fontName = await registerUnicodeFonts(doc);

  doc.setFontSize(16);
  doc.text(sanitizeExportValue(title), 40, 34);
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(sanitizeExportValue(`Exported: ${formatDateTimeForDisplay(new Date(), lang)}`), 40, 52);

  autoTable(doc, {
    startY: 66,
    head: [headers],
    body: rows,
    margin: { top: 66, right: 40, bottom: 40, left: 40 },
    theme: 'striped',
    styles: {
      font: fontName,
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
      valign: 'middle',
      lineColor: [220, 224, 230],
      lineWidth: 0.5,
    },
    headStyles: {
      font: fontName,
      fillColor: [25, 118, 210],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: normalizedColumns.reduce((accumulator, column, index) => {
      accumulator[index] = {
        halign: column.align,
      };
      return accumulator;
    }, {}),
    didDrawPage: ({ cursor }) => {
      if (summary.length > 0) {
        let y = (cursor?.y || 66) + 20;
        doc.setFont(fontName, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(60);
        summary.forEach((item) => {
          doc.text(sanitizeExportValue(`${item.label}: ${item.value}`), 40, y);
          y += 14;
        });
      }
    },
  });

  doc.save(buildExportFileName(fileBaseName, 'pdf'));
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const handlePrint = ({ data = [], columns = [], title = 'Report', summary = [], language = null }) => {
  const lang = language || i18n.language;
  const normalizedColumns = normalizeColumns(columns);
  const rows = normalizeRows(data, normalizedColumns, lang);
  const printWindow = window.open('', '_blank', 'width=1200,height=800');

  if (!printWindow) return;

  const headerHtml = normalizedColumns
    .map((column) => `<th style="text-align:${column.align}">${escapeHtml(column.header)}</th>`)
    .join('');

  const bodyHtml = rows.length
    ? rows
        .map(
          (row) => `
            <tr>
              ${row
                .map(
                  (cell, index) =>
                    `<td style="text-align:${normalizedColumns[index].align}">${escapeHtml(cell)}</td>`
                )
                .join('')}
            </tr>
          `
        )
        .join('')
    : `<tr><td colspan="${Math.max(normalizedColumns.length, 1)}" style="text-align:center">No data available</td></tr>`;

  const summaryHtml = summary.length
    ? `
      <div class="print-summary">
        ${summary.map((item) => `<div><strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.value)}</div>`).join('')}
      </div>
    `
    : '';

  printWindow.document.write(`
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>
          body {
            font-family: ${PRINT_FONT_STACK};
            padding: 24px;
            color: #1f2937;
          }
          h1 {
            margin: 0 0 8px;
            font-size: 22px;
          }
          .print-meta {
            margin-bottom: 20px;
            color: #6b7280;
            font-size: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          thead {
            display: table-header-group;
          }
          tr {
            page-break-inside: avoid;
          }
          th, td {
            border: 1px solid #d1d5db;
            padding: 8px 10px;
            vertical-align: top;
          }
          th {
            background: #e8f1fe;
            color: #0f172a;
            font-weight: 700;
          }
          tbody tr:nth-child(even) {
            background: #f8fafc;
          }
          .print-summary {
            margin-top: 18px;
            display: grid;
            gap: 6px;
            font-size: 12px;
          }
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        <div class="print-meta">Printed: ${escapeHtml(formatDateTimeForDisplay(new Date(), lang))}</div>
        <table>
          <thead>
            <tr>${headerHtml}</tr>
          </thead>
          <tbody>${bodyHtml}</tbody>
        </table>
        ${summaryHtml}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};
