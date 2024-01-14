// ParentComponent.js
import React, { useState, useContext } from 'react';
import AccountList from '../pages/accounts/AccountList';
import HomeList from '../pages/home/HomeList';
import ExpenseBudApi from '../api/api';
import UserContext from '../context/UserContext';
function ParentComponent() {
  const { currentUser } = useContext(UserContext);
  const [expenses, setExpenses] = useState({});
  const [syncLoading, setSyncLoading] = useState(false); // State for sync loading

  const syncTransactions = async (accountId) => {
    try {
      setSyncLoading(true);
      await ExpenseBudApi.transactionsSync(currentUser.id, { accountId });
      const updatedExpenses = await ExpenseBudApi.getAggregatedExpensesByCategory(currentUser.id);
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error('Error syncing transactions:', error);
      // handle error, maybe set an error state
    } finally {
      setSyncLoading(false);
    }
  };

  return (
    <div>
      <AccountList onTransactionsUpdated={syncTransactions} syncLoading={syncLoading} />
      <HomeList updatedExpenses={expenses} />
    </div>
  );
}

export default ParentComponent;