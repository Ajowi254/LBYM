//accountlist.js
import { useState, useEffect, useContext } from 'react';
import UserContext from '../../context/UserContext';
import PlaidLink from './PlaidLink';
import ExpenseBudApi from '../../api/api';
import AccountCard from './AccountCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import FlashMsg from '../../components/FlashMsg';
import './AccountList.css';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

function AccountList() {
  const { currentUser } = useContext(UserContext);
  const [accounts, setAccounts] = useState([]);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [errors, setErrors] = useState([]); // Added state for sync loading

  const deleteAccount = async (accountId) => {
    try {
      await ExpenseBudApi.deleteAccount(currentUser.id, accountId);
      setAccounts(accounts => accounts.filter(account => account.id !== accountId));
    } catch (err) {
      console.error('Error deleting account:', err);
    }
  };

  const syncTransactions = async (accountId) => {
    try {
      setSyncLoading(true); // Start loading
      const account = accounts.find(account => account.id === accountId);
      await ExpenseBudApi.transactionsSync({ access_token: account.access_token, accountId });
     // Refresh accounts list or update UI if necessary
      // Reset errors if sync is successful
      setErrors([]);
    } catch (err) {
      if (err.response && err.response.status === 500) {
        // Handle specific error message from backend
        console.error('Error syncing transactions:', err.response.data.details);
        setErrors(prevErrors => [...prevErrors, err.response.data.details]);
      } else {
        console.error('Error syncing transactions:', err);
        setErrors(prevErrors => [...prevErrors, err.message || "An error occurred during sync."]);
      }
    } finally {
      setSyncLoading(false); // End loading regardless of the outcome
    }
  };

  async function getAllAccounts() {
    try {
      const accountsData = await ExpenseBudApi.getAllAccounts(currentUser.id);
      setAccounts(accountsData);
      setInfoLoaded(true);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setInfoLoaded(true);
    }
  }

  useEffect(() => {
    if (currentUser) {
      getAllAccounts();
    }
  }, [currentUser]);

  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <div>
      <Typography component="h1" variant="h5">Accounts</Typography>
      <div className='AccountList-add-account'>
        <PlaidLink onLinkSuccess={getAllAccounts} />
      </div>
      <Typography variant="subtitle1">
        After an account is connected, click 'sync transactions' to import transactions.
      </Typography>
      <div className='AccountList-card-group'>
        {accounts.length ? accounts.map(account => (
          <AccountCard 
            key={account.id}
            id={account.id}
            type={account.account_type}
            name={account.institution_name}
            remove={deleteAccount}
            sync={syncTransactions}
            setSyncLoading={setSyncLoading} // Pass the setter function to the child component
          />
        )) : <h3>There are currently no accounts.</h3>}
        {!syncLoading && (
          <div className='AccountList-sync-loading'>
            <span>Syncing... &nbsp;</span>
            <CircularProgress />
          </div>
        )}
      </div> 
    </div>
  );
}

export default AccountList;
