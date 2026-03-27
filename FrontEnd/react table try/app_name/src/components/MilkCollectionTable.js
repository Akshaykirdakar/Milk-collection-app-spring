// MilkCollectionTable.jsx
import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';

export default function MilkCollectionTable({ data }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const columns = useMemo(
    () => [
      {
        header: 'Supplier Name',
        accessorKey: 'supplierName',
      },
      {
        header: 'Year',
        accessorKey: 'year',
      },
      {
        header: 'Date',
        accessorKey: 'date',
      },
      {
        header: 'Time',
        accessorKey: 'time',
        cell: info => (info.getValue() === 1 ? 'Morning' : info.getValue() === 2 ? 'Evening' : ''),
      },
      {
        header: 'Animal Type',
        accessorKey: 'animalType',
        cell: info => (info.getValue() === 1 ? 'Cow' : info.getValue() === 2 ? 'Buffalo' : ''),
      },
      {
        header: 'Liters',
        accessorKey: 'liters',
      },
      {
        header: 'Fat',
        accessorKey: 'fat',
      },
      {
        header: 'CLR',
        accessorKey: 'clr',
      },
      {
        header: 'SNF',
        accessorKey: 'snf',
      },
      {
        header: 'Rate',
        accessorKey: 'rate',
      },
      {
        header: 'Bill Amount',
        id: 'billAmount',
        cell: info => {
          const rate = info.row.original.rate;
          const liters = info.row.original.liters;
          const amount = Number(rate) * Number(liters);
          return isNaN(amount) ? '' : amount.toFixed(2);
        },
      },
    ],
    []
  );

  // Filtered data by date range
  const filteredData = useMemo(() => {
    if (!fromDate && !toDate) return data;
    return data.filter(row => {
      if (!row.date) return false;
      const rowDate = new Date(row.date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      if (from && rowDate < from) return false;
      if (to && rowDate > to) return false;
      return true;
    });
  }, [data, fromDate, toDate]);

  const table = useReactTable({
    data: filteredData || [],
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
  });

  // Export to Excel
  const exportToExcel = () => {
    const exportData = table.getRowModel().rows.map(row => {
      const rowObj = {};
      row.getVisibleCells().forEach(cell => {
        rowObj[cell.column.columnDef.header] = cell.getValue();
      });
      return rowObj;
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MilkCollection');
    XLSX.writeFile(wb, 'Milk_Collection.xlsx');
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const headers = table.getAllLeafColumns().map(col => col.columnDef.header);
    const rows = table.getRowModel().rows.map(row =>
      row.getVisibleCells().map(cell => cell.getValue())
    );
    autoTable(doc, {
      head: [headers],
      body: rows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [25, 118, 210] },
      margin: { top: 20 },
    });
    doc.save('Milk_Collection.pdf');
  };

  // Print Table
  const printTable = () => {
    const originalTable = document.getElementById('milkcollection-table');
    if (!originalTable) return;
    const tableClone = originalTable.cloneNode(true);
    const WinPrint = window.open('', '', 'width=900,height=650');
    WinPrint.document.write(`
      <html>
        <head>
          <title>Milk Collection</title>
          <style>
            @media print {
              @page { size: landscape; }
              body { margin: 10mm; }
              table { width: 100%; border-collapse: collapse; font-size: 12px; }
              th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
              .no-results { text-align: center; }
            }
          </style>
        </head>
        <body>
          ${tableClone.outerHTML}
        </body>
      </html>
    `);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  return (
    <div className="userlist-container">
      <div className="export-buttons" style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{ fontWeight: 500 }}>From:</label>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ padding: 4 }} />
          <label style={{ fontWeight: 500 }}>To:</label>
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={{ padding: 4 }} />
        </div>
        <input
          className="userlist-search"
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
        />
        <button className="btn-export excel" onClick={exportToExcel}>
          <FileDownloadOutlinedIcon className="export-icon" /> Export Excel
        </button>
        <button className="btn-export pdf" onClick={exportToPDF}>
          <PictureAsPdfOutlinedIcon className="export-icon" /> Export PDF
        </button>
        <button className="btn-export print" onClick={printTable}>
          <PrintOutlinedIcon className="export-icon" /> Print
        </button>
      </div>
      <table className="userlist-table" id="milkcollection-table" style={{ width: '100%', marginTop: '1rem', fontSize: '1rem' }}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={header.column.getCanSort() ? 'sortable' : ''}
                  style={{ cursor: header.column.getCanSort() ? 'pointer' : undefined }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() ? (header.column.getIsSorted() === 'asc' ? ' ▲' : ' ▼') : ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="no-results">
                No milk collection data available.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="userlist-table-total-row">
            {columns.map((col) => {
              if (col.accessorKey === 'liters') {
                const totalLiters = table.getRowModel().rows.reduce((sum, row) => {
                  const val = Number(row.original.liters);
                  return sum + (isNaN(val) ? 0 : val);
                }, 0);
                return <td key={col.id || col.accessorKey}>{totalLiters.toFixed(2)}</td>;
              }
              if (col.id === 'billAmount') {
                const totalBill = table.getRowModel().rows.reduce((sum, row) => {
                  const rate = Number(row.original.rate);
                  const liters = Number(row.original.liters);
                  const amt = rate * liters;
                  return sum + (isNaN(amt) ? 0 : amt);
                }, 0);
                return <td key={col.id}>{totalBill.toFixed(2)}</td>;
              }
              if (col.accessorKey === 'rate') {
                const rates = table.getRowModel().rows.map(row => Number(row.original.rate)).filter(val => !isNaN(val));
                const avgRate = rates.length > 0 ? (rates.reduce((a, b) => a + b, 0) / rates.length) : 0;
                return <td key={col.id || col.accessorKey}>{avgRate.toFixed(2)}</td>;
              }
              if (col === columns[0]) {
                return <td key={col.id || col.accessorKey} style={{ textAlign: 'right' }}>Total</td>;
              }
              return <td key={col.id || col.accessorKey}></td>;
            })}
          </tr>
        </tfoot>
      </table>
      <div className="userlist-pagination">
        <button className="pagination-btn" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {'<'} Prev
        </button>
        <button className="pagination-btn" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next {'>'}
        </button>
        <span className="pagination-info">
          Page <strong>{table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</strong>
        </span>
        <select
          className="pagination-select"
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
        >
          {[5, 10, 20].map(pageSize => (
            <option key={pageSize} value={pageSize}>Show {pageSize}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
