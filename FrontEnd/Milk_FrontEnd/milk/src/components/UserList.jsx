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
import SearchIcon from '@mui/icons-material/Search';

import { API_URLS } from '../config/api';
import { useTranslation } from 'react-i18next';
import AddUser from './AddUser';
import { useNavigate } from 'react-router-dom';
import DataExportToolbar from './DataExportToolbar';
import { exportToExcel, exportToPDF, handlePrint } from '../utils/exportUtils';
import { PageHeader, SectionCard } from './UIComponents';

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

  const exportRows = table.getPrePaginationRowModel().rows.map((row) => row.original);
  const exportColumns = [
    { key: 'id', header: t('userId', 'ID') },
    {
      key: 'name',
      header: t('name', 'Name'),
      getValue: (row) => [row.firstName, row.middleName, row.lastName].filter(Boolean).join(' '),
    },
    { key: 'username', header: t('username', 'Username') },
    { key: 'role', header: t('role', 'Role') },
    { key: 'userMobile', header: t('userMobile', 'Mobile') },
    { key: 'userEmail', header: t('userEmail', 'Email') },
    { key: 'userGender', header: t('userGender', 'Gender') },
    { key: 'userActiveInactive', header: t('userActiveInactive', 'Status') },
    { key: 'createdAt', header: t('createdAt', 'Created At'), type: 'date' },
    { key: 'updatedAt', header: t('updatedAt', 'Updated At'), type: 'date' },
  ];

  const exportSummary = [
    { label: t('userListTitle', 'User List'), value: `${exportRows.length} records` },
  ];
  
  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <PageHeader
          title={t('userListTitle')}
          subtitle="Manage supplier records in one place."
          sx={{ mb: 0, flex: '1 1 auto' }}
        />

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e6e6e6',
            px: 2,
            minHeight: 48,
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
              sx={{ minWidth: 220 }}
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

      <SectionCard
        noPadding
        sx={{
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.neutral' }}>
          <DataExportToolbar
            onExcel={() =>
              exportToExcel({
                data: exportRows,
                columns: exportColumns,
                fileBaseName: 'UserList',
                sheetName: 'Users',
              })
            }
            onPDF={() =>
              exportToPDF({
                data: exportRows,
                columns: exportColumns,
                title: t('userListTitle', 'User List'),
                fileBaseName: 'UserList',
                summary: exportSummary,
              })
            }
            onPrint={() =>
              handlePrint({
                data: exportRows,
                columns: exportColumns,
                title: t('userListTitle', 'User List'),
                summary: exportSummary,
              })
            }
          />
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
                      No matching records found.
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
      </SectionCard>

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
