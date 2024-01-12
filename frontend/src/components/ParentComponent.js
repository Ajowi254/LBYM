// ParentComponent.js
import React, { useState, useContext } from 'react';
import AccountList from '../pages/accounts/AccountList';
import HomeList from '../pages/home/HomeList';
import ExpenseBudApi from '../api/api';
import UserContext from '../context/UserContext';

function ParentComponent() {
  const { currentUser } = useContext(UserContext);
  const [expenses, setExpenses] = useState({}); // State for expenses

  const handleTransactionsUpdated = async () => {
    // Assuming currentUser.id is defined and correct
    const updatedExpenses = await ExpenseBudApi.getTotalExpensesByCategory(currentUser.id);
    setExpenses(updatedExpenses); // Update expenses state
  };

  // Make sure to pass down the updater function to AccountList
  // and the updated expenses state to HomeList as props
  return (
    <div>
      <AccountList onTransactionsUpdated={handleTransactionsUpdated} />
      <HomeList updatedExpenses={expenses} /> {/* Pass updated expenses as prop */}
    </div>
  );
}

export default ParentComponent;
