// AccountList.js
import React, { useState, useEffect, useContext } from 'react';
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
  const [errors, setErrors] = useState([]);
  const [expenses, setExpenses] = useState({});

  const updateExpenses = async () => {
    try {
      // Fetch the sum of expenses by category from the database
      const expensesData = await ExpenseBudApi.getSumByCategory(currentUser.id);
      
      // Update the state with the new expenses data
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error updating expenses:', error);
    }
  };

  const deleteAccount = async (accountId) => {
    try {
      await ExpenseBudApi.deleteAccount(currentUser.id, accountId);
      setAccounts(accounts => accounts.filter(account => account.id !== accountId));
    } catch (err) {
      console.error('Error deleting account:', err);
    }
  };

  const syncTransactions = async (accountId) => {
    setSyncLoading(true);
    try {
      const account = accounts.find(account => account.id === accountId);
      await ExpenseBudApi.transactionsSync({ access_token: account.access_token, accountId });
      
      // Fetch aggregated expenses by category after syncing transactions
      const expenses = await ExpenseBudApi.getSumByCategory(currentUser.id);
      await updateExpenses(expenses); // Update the state in the parent component
    } catch (error) {
      console.error('Error syncing transactions:', error);
      setErrors(prevErrors => [...prevErrors, error]);
    } finally {
      setSyncLoading(false);
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
      {errors.map((error, index) => (
        <p key={index} style={{ color: 'red' }}>{error.toString()}</p>
      ))}
      <div className='AccountList-card-group'>
        {accounts.length ? accounts.map(account => (
          <AccountCard 
            key={account.id}
            id={account.id}
            type={account.account_type}
            name={account.institution_name}
            remove={deleteAccount}
            sync={syncTransactions}
            setSyncLoading={setSyncLoading}
            updateExpenses={updateExpenses} 
          />
        )) : <h3>There are currently no accounts.</h3>}
        {syncLoading && (
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
