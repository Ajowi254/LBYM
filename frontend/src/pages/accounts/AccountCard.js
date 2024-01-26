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

  return (
    <Card sx={{ minWidth: 10, width: 190 }} className='AccountList-card'>
      <CardContent>
        <Typography>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {type}
        </Typography>
      </CardContent>
      <CardActions >
        <Button size="small" color="success" sx={{textAlign: 'left'}} onClick={()=>syncTransactions(id)}>Sync transactions</Button>
        
        <Tooltip title='Deleting account will also remove all associated expense transactions.'>
          <IconButton onClick={()=>remove(id)}>
            <DeleteIcon fontSize="small"/>
          </IconButton>
        </Tooltip>
      </CardActions>
      {syncError.length
        ? <FlashMsg type='warning' messages={["Transactions already synced."]} />
        : null}
      {syncConfirmed && <FlashMsg type='success' messages={['Sync success.']} />}
    </Card>
  )
}

export default AccountCard;
