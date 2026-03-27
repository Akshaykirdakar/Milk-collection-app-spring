import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Typography,
  TextField,
  Button,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from '@mui/material';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';

import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SearchIcon from '@mui/icons-material/Search';

import { API_URLS } from '../config/api';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { useTranslation } from 'react-i18next';
import AddUser from './AddUser';
import { useNavigate } from 'react-router-dom';

export default function UserList() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editUserData, setEditUserData] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();


  const fetchData = () => {
    fetch(API_URLS.getUser)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = useCallback((id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    fetch(`${API_URLS.getUser}/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete user');
        fetchData();
      })
      .catch(err => {
        alert('Error deleting user: ' + err.message);
      });
  }, []);

  const openEditUser = useCallback((id) => {
    fetch(`${API_URLS.getUser}/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user data');
        return res.json();
      })
      .then(data => {
        setEditUserData(data);
        setEditUserId(id);
        setShowAddUser(true);
      })
      .catch(err => alert('Failed to load user: ' + err.message));
  }, []);

  const columns = useMemo(() => [
    { accessorKey: 'id', header: t('userId', 'ID') },
    {
      accessorKey: 'name',
      header: t('name', 'Name'),
      cell: ({ row }) => {
        const { firstName, middleName, lastName } = row.original;
        return [firstName, middleName, lastName].filter(Boolean).join(' ');
      },
    },
    { accessorKey: 'username', header: t('username', 'Username') },
    { accessorKey: 'role', header: t('role', 'Role') },
    { accessorKey: 'userMobile', header: t('userMobile', 'Mobile') },
    { accessorKey: 'userEmail', header: t('userEmail', 'Email') },
    { accessorKey: 'userGender', header: t('userGender', 'Gender') },
    { accessorKey: 'userActiveInactive', header: t('userActiveInactive', 'Status') },
    { accessorKey: 'createdAt', header: t('createdAt', 'Created At') },
    { accessorKey: 'updatedAt', header: t('updatedAt', 'Updated At') },
    {
      id: 'actions',
      header: t('action', 'Actions'),
      cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={t('edit', 'Edit')}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                openEditUser(row.original.id);
              }}
              sx={{
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.lighter',
                },
              }}
            >
              <ModeEditOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('delete', 'Delete')}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row.original.id);
              }}
              sx={{
                color: 'error.main',
                '&:hover': {
                  bgcolor: 'error.lighter',
                },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ], [handleDelete, openEditUser, t]);

  const globalFilterFn = (row, columnId, filterValue) => {
    const search = filterValue.toLowerCase();
    return row.getVisibleCells().some(cell => {
      const val = cell.getValue();
      return String(val ?? '').toLowerCase().includes(search);
    });
  };

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn,
  });

  const exportExcel = () => {
    const excelData = table.getRowModel().rows.map(row => {
      const rowObj = {};
      columns.forEach(col => {
        if (col.id !== 'actions') {
          rowObj[col.header] = row.getValue(col.accessorKey);
        }
      });
      return rowObj;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'users.xlsx');
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const columnsToExport = columns.filter(col => col.id !== 'actions');
    const headers = columnsToExport.map(col => col.header);
    const rows = table.getRowModel().rows.map(row =>
      columnsToExport.map(col => String(row.getValue(col.accessorKey) ?? ''))
    );

    doc.text('User List', 40, 30);
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 50,
      margin: { left: 40, right: 40, top: 50, bottom: 20 },
      styles: {
        fontSize: 5,
        overflow: 'linebreak',
        cellPadding: 3,
        valign: 'middle',
        halign: 'left',
      },
      theme: 'striped',
    });

    doc.save('users.pdf');
  };

  const printTable = () => {
    const originalTable = document.getElementById('userlist-table');
    if (!originalTable) return;

    const tableClone = originalTable.cloneNode(true);
    const headers = tableClone.querySelectorAll('thead th');
    let actionColIndex = -1;
    headers.forEach((th, i) => {
      if (th.textContent.trim() === 'Actions') {
        actionColIndex = i;
      }
    });

    if (actionColIndex !== -1) {
      headers[actionColIndex].remove();
      const rows = tableClone.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells[actionColIndex]) cells[actionColIndex].remove();
      });
    }

    const WinPrint = window.open('', '', 'width=900,height=650');
    WinPrint.document.write(`
      <html>
        <head>
          <title>User List</title>
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

  const theme = useTheme();
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {t('userListTitle')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'background.paper',
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            px: 2,
          }}>
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <TextField
              variant="standard"
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder={t('search', 'Search all columns...')}
              InputProps={{
                disableUnderline: true,
              }}
              sx={{ minWidth: 200 }}
            />
          </Box>

          <Button
            variant="contained"
            onClick={() => {
              setShowAddUser(true);
              setEditUserId(null);
              setEditUserData(null);
            }}
            sx={{ 
              textTransform: 'none',
              px: 3,
            }}
          >
            {t('addUser')}
          </Button>
        </Box>
      </Box>

      <Paper 
        elevation={0} 
        variant="outlined" 
        sx={{ 
          mb: 3,
          borderRadius: 1,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.neutral' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={t('exportToExcel', 'Export to Excel')}>
              <Button
                startIcon={<FileDownloadOutlinedIcon />}
                onClick={exportExcel}
                variant="outlined"
                size="small"
                sx={{ textTransform: 'none' }}
              >
                Excel
              </Button>
            </Tooltip>
            <Tooltip title={t('exportToPDF', 'Export to PDF')}>
              <Button
                startIcon={<PictureAsPdfOutlinedIcon />}
                onClick={exportPDF}
                variant="outlined"
                size="small"
                sx={{ textTransform: 'none' }}
              >
                PDF
              </Button>
            </Tooltip>
            <Tooltip title={t('print', 'Print')}>
              <Button
                startIcon={<PrintOutlinedIcon />}
                onClick={printTable}
                variant="outlined"
                size="small"
                sx={{ textTransform: 'none' }}
              >
                Print
              </Button>
            </Tooltip>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {table.getHeaderGroups().map(headerGroup => (
                  <React.Fragment key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableCell
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        sx={{
                          fontWeight: 600,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <Box sx={{ ml: 1, color: 'text.secondary' }}>
                            {{
                              asc: '↑',
                              desc: '↓',
                            }[header.column.getIsSorted()] ?? null}
                          </Box>
                        </Box>
                      </TableCell>
                    ))}
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={() => {
                      navigate(`/user/${row.original.id}`, { state: { user: row.original } });
                    }}
                    sx={{
                      cursor: 'pointer',
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell ?? cell.column.columnDef.header, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No results found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          p: 2,
          borderTop: 1,
          borderColor: 'divider'
        }}>
          <TablePagination
            component="div"
            count={table.getFilteredRowModel().rows.length}
            page={table.getState().pagination.pageIndex}
            onPageChange={(_, newPage) => table.setPageIndex(newPage)}
            rowsPerPage={table.getState().pagination.pageSize}
            onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
            rowsPerPageOptions={[5, 10, 20]}
            sx={{
              '.MuiTablePagination-select': {
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
              },
            }}
          />
        </Box>
      </Paper>

      <Dialog
        open={showAddUser}
        onClose={() => {
          setShowAddUser(false);
          setEditUserId(null);
          setEditUserData(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <AddUser
          onClose={() => {
            setShowAddUser(false);
            setEditUserId(null);
            setEditUserData(null);
          }}
          refreshData={fetchData}
          userData={editUserData}
          userId={editUserId}
        />
      </Dialog>
    </Box>
  );
}
