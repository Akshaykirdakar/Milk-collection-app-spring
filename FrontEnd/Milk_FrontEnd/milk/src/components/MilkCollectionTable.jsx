// MilkCollectionTable.jsx
import React, { useMemo, useState } from 'react';
import { Box, TextField } from '@mui/material';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import DataExportToolbar from './DataExportToolbar';
import { exportToExcel, exportToPDF, handlePrint } from '../utils/exportUtils';

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

  const exportRows = table.getPrePaginationRowModel().rows.map((row) => row.original);
  const totalLiters = exportRows.reduce((sum, row) => sum + (Number(row.liters) || 0), 0);
  const totalBill = exportRows.reduce(
    (sum, row) => sum + (Number(row.rate) || 0) * (Number(row.liters) || 0),
    0
  );
  const exportColumns = [
    { key: 'supplierName', header: 'Supplier Name' },
    { key: 'year', header: 'Year' },
    { key: 'date', header: 'Date', type: 'date' },
    { key: 'time', header: 'Time' },
    { key: 'animalType', header: 'Animal Type' },
    { key: 'liters', header: 'Liters', type: 'number' },
    { key: 'fat', header: 'Fat', type: 'number' },
    { key: 'clr', header: 'CLR', type: 'number' },
    { key: 'snf', header: 'SNF', type: 'number' },
    { key: 'rate', header: 'Rate', type: 'number' },
    {
      key: 'billAmount',
      header: 'Bill Amount',
      type: 'number',
      getValue: (row) => (Number(row.rate) || 0) * (Number(row.liters) || 0),
    },
  ];
  const exportSummary = [
    { label: 'Records', value: exportRows.length },
    { label: 'Total Liters', value: totalLiters.toFixed(2) },
    { label: 'Total Bill Amount', value: totalBill.toFixed(2) },
  ];

  return (
    <div className="userlist-container">
      <Box
        className="no-print"
        sx={{
          display: 'flex',
          gap: 2,
          marginBottom: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            label="From"
            type="date"
            size="small"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="To"
            type="date"
            size="small"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            size="small"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
          />
        </Box>
        <DataExportToolbar
          onExcel={() =>
            exportToExcel({
              data: exportRows,
              columns: exportColumns,
              fileBaseName: 'MilkEntries',
              sheetName: 'MilkEntries',
            })
          }
          onPDF={() =>
            exportToPDF({
              data: exportRows,
              columns: exportColumns,
              title: 'Milk Collection Report',
              fileBaseName: 'MilkEntries',
              summary: exportSummary,
            })
          }
          onPrint={() =>
            handlePrint({
              data: exportRows,
              columns: exportColumns,
              title: 'Milk Collection Report',
              summary: exportSummary,
            })
          }
        />
      </Box>
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
