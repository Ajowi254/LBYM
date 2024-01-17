//accountcard.js
import React, { useState, useContext } from 'react';
import FlashMsg from '../../components/FlashMsg';
import './AccountList.css';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ExpenseBudApi from '../../api/api';
import UserContext from '../../context/UserContext'; // Import UserContext

function AccountCard({ id, type, name, remove, sync, setSyncLoading, updateExpenses }) {
  const { currentUser } = useContext(UserContext); // Use useContext to access currentUser
  const [syncError, setSyncError] = useState(false);
  const [syncConfirmed, setSyncConfirmed] = useState(false);

  const syncTransactions = async (bankId) => {
    try {
      setSyncLoading(true);
      setSyncError(false);
      setSyncConfirmed(false);
      let syncResult = await sync(bankId);
      if (!syncResult.success) {
        setSyncError(syncResult.err);
      } else {
        setSyncConfirmed(true);
        // Fetch aggregated expenses by category after syncing transactions
        const expenses = await ExpenseBudApi.getSumByCategory(currentUser.id);
        updateExpenses(expenses);
      }
    } catch (error) {
      setSyncError(error.message);
    } finally {
      setSyncLoading(false);
    }
  };

  const assignExpenses = async () => {
    try {
      // Fetch the sum of expenses by category
      const expenses = await ExpenseBudApi.getSumByCategory(currentUser.id);
      // Update the state in the parent component
      updateExpenses(expenses);
    } catch (error) {
      console.error('Error assigning expenses:', error);
    }
  };

  return (
    <Card sx={{ minWidth: 275 }} className='AccountList-card'>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {type}
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={() => syncTransactions(id)}>
          Sync transactions
        </Button>
        {syncConfirmed && (
          <Button size="small" color="primary" onClick={assignExpenses}>
            Assign Expenses
          </Button>
        )}
        <Tooltip title="Delete Account">
          <IconButton aria-label="delete" onClick={() => remove(id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
      {syncError && <FlashMsg type='error' messages={['An error occurred during sync.']} />}
      {syncConfirmed && <FlashMsg type='success' messages={['Transactions synced successfully!']} />}
    </Card>
  );
}

export default AccountCard;