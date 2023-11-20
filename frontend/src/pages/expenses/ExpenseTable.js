import { useState } from 'react';
import { parseISO } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';

import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

function ExpenseTable({data, deleteExpense, showPagination=true, numRows=5}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(numRows);
  
  const reformattedData = data.map(item => {
    const parsedDate = utcToZonedTime(parseISO(item.date), 'UTC');
    const reformattedDate = format(parsedDate, "yyyy-MM-dd");
    
    return {
      ...item,
      date: reformattedDate
    };
  });

  const columns = [
    { id: 'date', label: 'Date' },
    { id: 'vendor', label: 'Vendor' },
    { id: 'amount', label: 'Amount' },
    { id: 'category', label: 'Category' },
    { id: 'description', label: 'Description' }
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: '90%', mt: 4, overflowX: 'auto'}}>
      <TableContainer sx={{ width: '100%', maxHeight: '70vh' }}>
        <Table size="small" sx={{ minWidth: 100 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {reformattedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {row[column.id]}
                    </TableCell>
                  ))}
                  <TableCell>
                    {/* <IconButton>
                      <EditIcon fontSize="small" />
                    </IconButton> */}  
                    {deleteExpense && (
                    <IconButton onClick={()=> deleteExpense(row.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    )} 
                    
                  </TableCell>

                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showPagination && (
        <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      )}
    </Paper>
  );
  
}

export default ExpenseTable;