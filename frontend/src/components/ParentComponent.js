import React, { useContext, useState, useEffect } from 'react';
import AccountList from '../pages/accounts/AccountList';
import HomeList from '../pages/home/HomeList';
import ExpenseBudApi from '../api/api';
import UserContext from '../context/UserContext';

function ParentComponent() {
  const { currentUser } = useContext(UserContext);
  const [expenses, setExpenses] = useState({});

  useEffect(() => {
    if (currentUser) {
      // Fetch aggregated expenses by category on initial render
      const fetchExpenses = async () => {
        const initialExpenses = await ExpenseBudApi.getSumByCategory(currentUser.id);
        setExpenses(initialExpenses);
      };

      fetchExpenses();
    }
  }, [currentUser]);

  return (
    <div>
      <AccountList updateExpenses={setExpenses} />
      <HomeList updatedExpenses={expenses} />
    </div>
  );
}

export default ParentComponent;
