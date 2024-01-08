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
  const {currentUser} = useContext(UserContext);
  const [accounts, setAccounts] = useState([]);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [syncLoading, setSyncLoading] = useState(true);

  const deleteAccount = async (accountId) => {
    try {
      await ExpenseBudApi.deleteAccount(currentUser.id, accountId);
      setAccounts(accounts => accounts.filter( account => account.id !== accountId ));
      return {success: true};
    } catch (err) {
      return {success: false, err};
    }
  }

  const syncTransactions = async (accountId) => {
    try {
      let access_token = accounts.filter(account => account.id === accountId)[0].access_token;
      await ExpenseBudApi.transactionsSync({access_token, accountId});
      return {success: true}
    } catch (err) {
      return {success: false, err}
    }
  }

  //function is outside of useEffect to allow handleAccessTokenSuccess to work
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
    <Typography component="h1" variant="h5">
      Accounts
    </Typography>
    <div className='AccountList-add-account'>
      <FlashMsg type='info' messages={["The button below currently links to Plaid's sandbox mode. If prompted for username and password, username= user_good, password= pass_good"]}/>
      <PlaidLink onLinkSuccess={handleAccessTokenSuccess}/>
    </div>

    <Typography variant="subtitle1">
      After an account is connected, click 'sync transactions' to import transactions. Go to Expenses tab to view import.
    </Typography>

    <div className='AccountList-card-group'>
      {accounts.length
        ? ( accounts.map(account => (
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
        <span>Syncing... &nbsp;</span>
        <CircularProgress />
      </div>
      )}
    </div> 
  </div>
  )
}
export default AccountList;