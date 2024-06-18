"use client";

import React, { useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Container, Box, Chip, createTheme, ThemeProvider, LinearProgress, Typography, TextField, Toolbar, InputAdornment, TableSortLabel, Checkbox, TablePagination } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { rows as initialRows } from './data';

type Row = {
    id: number;
    name: string;
    country: string;
    agent: string;
    date: string;
    balance: string;
    status: string;
    activity: string;
  };
  
type RowKey = keyof Row;

const statusColors: { [key: string]: { backgroundColor: string; color: string } } = {
  'PROPOSAL': { backgroundColor: '#fcd5af', color: '#86633c' },
  'QUALIFIED': { backgroundColor: '#c5e3c6', color: '#426d45' },
  'RENEWAL': { backgroundColor: '#eacdfc', color: '#69487e' },
  'NEW': { backgroundColor: '#b2e2f7', color: '#457492' },
  'UNQUALIFIED': { backgroundColor: '#fccbcf', color: '#9a454a' }
};

const columns = [
  { id: 'name', label: 'Name' },
  { id: 'country', label: 'Country' },
  { id: 'agent', label: 'Agent' },
  { id: 'date', label: 'Date' },
  { id: 'balance', label: 'Balance' },
  { id: 'status', label: 'Status' },
  { id: 'activity', label: 'Activity' }
];

const CustomerTable = () => {
  const [rows, setRows] = useState(initialRows);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('name');
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const numSelected = selected.length;
  const rowCount = rows.length;
  const isIndeterminate = numSelected > 0 && numSelected < rowCount;
  const isChecked = rowCount > 0 && numSelected === rowCount;


  const handleRequestSort = (property: keyof Row) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    
    const sortedRows = rows.slice().sort((a, b) => {
      if (a[property] < b[property]) {
        return isAsc ? -1 : 1;
      }
      if (a[property] > b[property]) {
        return isAsc ? 1 : -1;
      }
      return 0;
    });
    setRows(sortedRows);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value.toLowerCase();
    const filteredRows = initialRows.filter(row => {
      return (
        row.name.toLowerCase().includes(searchText) ||
        row.country.toLowerCase().includes(searchText) ||
        row.agent.toLowerCase().includes(searchText)
      );
    });
    setRows(filteredRows);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  
  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];
  
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
  
    setSelected(newSelected);
  };


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Container>
        <Box sx={{ flexGrow: 1, marginTop: 2, backgroundColor: 'white' }}>
        <Toolbar>
        <Typography variant="h6" component="div" sx={{ color: 'black' }}>
            Customers
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <TextField
                variant="outlined"
                placeholder="Keyword Search"
                onChange={handleSearch}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                    ),
                }}
                />
            </Box>
            </Toolbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                <div role="checkbox">
                <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isChecked}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all rows' }}
                  />
                </div>    
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id as RowKey)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                const isItemSelected = selected.indexOf(row.name) !== -1;
                const labelId = `enhanced-table-checkbox-${row.name}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                    onClick={(event) => handleClick(event, row.name)}
                  >
                    <TableCell padding="checkbox">
                    <div role="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </div>  
                    </TableCell>
                    <TableCell component="td" id={labelId} scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.country}</TableCell>
                    <TableCell>{row.agent}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.balance}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        style={{
                          backgroundColor: statusColors[row.status].backgroundColor,
                          color: statusColors[row.status].color,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <LinearProgress variant="determinate" value={parseInt(row.activity, 10)} sx={{ width: '80%', alignSelf: 'center' }} />
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default CustomerTable;
