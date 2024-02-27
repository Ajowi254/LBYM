// AccountList.js
import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../../context/UserContext';
import ExpensesContext from '../../context/ExpensesContext';
import ExpenseBudApi from '../../api/api';
import AccountCard from './AccountCard';
import PlaidLink from './PlaidLink';
import LoadingSpinner from '../../components/LoadingSpinner';
import FlashMsg from '../../components/FlashMsg';
import Nav from '../../components/Nav';
import NavWithDrawer from '../../components/NavWithDrawer';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import NotificationBanner from '../../components/NotificationBanner.js';

function AccountList() {
  const { currentUser } = useContext(UserContext);
  const [accounts, setAccounts] = useState([]);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [syncLoading, setSyncLoading] = useState(true);
  const { expenses, setExpenses } = useContext(ExpensesContext);

  const deleteAccount = async (accountId) => {
    try {
      await ExpenseBudApi.deleteAccount(currentUser.id, accountId);
      setAccounts(accounts => accounts.filter(account => account.id !== accountId));
      return { success: true };
    } catch (err) {
      return { success: false, err };
    }
  }

  const syncTransactions = async (accountId) => {
    console.log('syncTransactions called');
    try {
      let access_token = accounts.filter(account => account.id === accountId)[0].access_token;
      const syncResponse = await ExpenseBudApi.transactionsSync({ access_token, accountId });
      console.log('Sync response:', syncResponse);
      // Fetch aggregated expenses by category after syncing transactions
      const expenses = await ExpenseBudApi.getSumByCategory(currentUser.id);
      console.log('Fetched expenses:', expenses);
      // Update the state in the parent component
      setExpenses(expenses);
      return { success: true }
    } catch (err) {
      return { success: false, err }
    }
  }
  // function is outside of useEffect to allow handleAccessTokenSuccess to work
  async function getAllAccounts() {
    try {
      let accounts = await ExpenseBudApi.getAllAccounts(currentUser.id);
      setAccounts(accounts);
    } catch (err) {
      console.error(err);
    }
    setInfoLoaded(true);
  }

  useEffect(() => {
    setInfoLoaded(false);
    getAllAccounts();
  }, [])

  async function handleAccessTokenSuccess() {
    await getAllAccounts()
  }
  if (!infoLoaded) return <LoadingSpinner />

  return (
    <div>
      <Nav />
      <NotificationBanner /> 
      <Typography component="h1" variant="h5">
        Accounts
      </Typography>
      <div className='AccountList-add-account'>
        <FlashMsg type='info' messages={["The button below currently links to Plaid's sandbox mode. If prompted for username and password, username= user_good, password= pass_good"]} />
        <PlaidLink onLinkSuccess={handleAccessTokenSuccess} />
      </div>

      <Typography variant="subtitle1">
        After an account is connected, click 'sync transactions' to import transactions. Go to Expenses tab to view import.
      </Typography>

      <div className='AccountList-card-group'>
        {accounts.length
          ? (accounts.map(account => (
            <AccountCard
              key={account.id}
              id={account.id}
              type={account.account_type}
              name={account.institution_name}
              remove={deleteAccount}
              sync={syncTransactions}
              setSyncLoading={setSyncLoading}
            />
          )))
          : <h3>There are currently no accounts.</h3>

        }
        {!syncLoading && (
          <div className='AccountList-sync-loading'>
            <span>Syncing...  </span>
            <CircularProgress />
          </div>
        )}
      </div>
      <NavWithDrawer hideAvatar={true} />
    </div>
  )
}
export default AccountList;
