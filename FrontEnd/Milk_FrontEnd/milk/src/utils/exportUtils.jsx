import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PAD = (value) => String(value).padStart(2, '0');
const PDF_FONT_FILE = 'Mangal.ttf';
const PDF_FONT_NAME = 'Mangal';
const PRINT_FONT_STACK = '"Mangal", "Nirmala UI", "Aparajita", Arial, sans-serif';
let pdfFontBase64Promise;

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

const loadPdfFontBase64 = async () => {
  if (!pdfFontBase64Promise) {
    const fontUrl = `${process.env.PUBLIC_URL || ''}/fonts/Mangal.ttf`;
    pdfFontBase64Promise = fetch(fontUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load PDF font from ${fontUrl}`);
        }

        return response.arrayBuffer();
      })
      .then((buffer) => arrayBufferToBase64(buffer));
  }

  return pdfFontBase64Promise;
};

const registerUnicodeFont = async (doc) => {
  const fontBase64 = await loadPdfFontBase64();
  doc.addFileToVFS(PDF_FONT_FILE, fontBase64);
  doc.addFont(PDF_FONT_FILE, PDF_FONT_NAME, 'normal');
  doc.setFont(PDF_FONT_NAME, 'normal');
};

export const formatDateForDisplay = (value) => {
  if (!value) return '';

  const normalized = typeof value === 'string' ? value.trim() : value;
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return sanitizeExportValue(value);
  }

  return `${PAD(date.getDate())}-${PAD(date.getMonth() + 1)}-${date.getFullYear()}`;
};

export const formatDateTimeForDisplay = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return `${formatDateForDisplay(date)} ${PAD(date.getHours())}:${PAD(date.getMinutes())}`;
};

export const formatCodeValue = (field, value) => {
  if (field === 'time') {
    if (Number(value) === 1) return 'Morning';
    if (Number(value) === 2) return 'Evening';
  }

  if (field === 'animalType') {
    if (Number(value) === 1) return 'Cow';
    if (Number(value) === 2) return 'Buffalo';
  }

  return value;
};

export const formatValueByType = (value, type, field) => {
  const codeFormatted = formatCodeValue(field, value);

  if (codeFormatted === '' || codeFormatted === null || codeFormatted === undefined) {
    return '';
  }

  if (type === 'date') {
    return formatDateForDisplay(codeFormatted);
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

const normalizeRows = (rows = [], columns = []) =>
  rows.map((row) =>
    columns.map((column) => formatValueByType(column.getValue(row), column.type, column.key))
  );

const normalizeObjects = (rows = [], columns = []) =>
  rows.map((row) =>
    columns.reduce((accumulator, column) => {
      accumulator[column.header] = formatValueByType(
        column.getValue(row),
        column.type,
        column.key
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

export const exportToExcel = ({ data = [], columns = [], fileBaseName = 'Export', sheetName = 'Report' }) => {
  const normalizedColumns = normalizeColumns(columns);
  const headers = normalizedColumns.map((column) => sanitizeExportValue(column.header));
  const rows = normalizeRows(data, normalizedColumns);
  const rowObjects = normalizeObjects(data, normalizedColumns);
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
}) => {
  const normalizedColumns = normalizeColumns(columns);
  const headers = normalizedColumns.map((column) => sanitizeExportValue(column.header));
  const rows = normalizeRows(data, normalizedColumns);
  const doc = new jsPDF({
    orientation,
    unit: 'pt',
    format: 'a4',
  });
  await registerUnicodeFont(doc);

  doc.setFontSize(16);
  doc.text(sanitizeExportValue(title), 40, 34);
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(sanitizeExportValue(`Exported: ${formatDateTimeForDisplay(new Date())}`), 40, 52);

  autoTable(doc, {
    startY: 66,
    head: [headers],
    body: rows,
    margin: { top: 66, right: 40, bottom: 40, left: 40 },
    theme: 'striped',
    styles: {
      font: PDF_FONT_NAME,
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
      valign: 'middle',
      lineColor: [220, 224, 230],
      lineWidth: 0.5,
    },
    headStyles: {
      font: PDF_FONT_NAME,
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
        doc.setFont(PDF_FONT_NAME, 'normal');
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

export const handlePrint = ({ data = [], columns = [], title = 'Report', summary = [] }) => {
  const normalizedColumns = normalizeColumns(columns);
  const rows = normalizeRows(data, normalizedColumns);
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
        <div class="print-meta">Printed: ${escapeHtml(formatDateTimeForDisplay(new Date()))}</div>
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
