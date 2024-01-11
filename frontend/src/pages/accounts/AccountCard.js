//accountcard.js
import React, { useState } from 'react';

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

function AccountCard({ id, type, name, remove, sync, setSyncLoading }) {
  const [syncError, setSyncError] = useState(false);
  const [syncConfirmed, setSyncConfirmed] = useState(false);

  const syncTransactions = async (bankId) => {
    try {
      setSyncLoading(true); // Set loading to true before starting the sync
      setSyncError(false);
      setSyncConfirmed(false);
      let syncResult = await sync(bankId);
      if (!syncResult.success) {
        setSyncError(syncResult.err);
      } else {
        setSyncConfirmed(true);
      }
    } catch (error) {
      setSyncError(error.message);
    } finally {
      setSyncLoading(false); // Set loading to false after sync is complete
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
