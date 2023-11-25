//accountcard.js
import { useState } from 'react';

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
  const [syncError, setSyncError] = useState([]);
  const [syncConfirmed, setSyncConfirmed] = useState(false);
  
  const syncTransactions = async (bankId) => {
    setSyncError(false);
    setSyncLoading(false);
    let syncResult = await sync(bankId);
    setSyncLoading(true);
    if (!syncResult.success) {
      setSyncError(syncResult.err);
    } else {
      setSyncConfirmed(true); 
    }
  } 
  

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