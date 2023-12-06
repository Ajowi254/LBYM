import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../context/UserContext';
import ExpenseBudApi from '../../api/api';
import Budget from './Budget';

function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    async function fetchBudgets() {
      try {
        const userId = currentUser.id;
        const fetchedBudgets = await ExpenseBudApi.getAllBudgets(userId);
        setBudgets(fetchedBudgets);
      } catch (error) {
        console.error('Error fetching budgets', error);
      }
    }

    if (currentUser) {
      fetchBudgets();
    }
  }, [currentUser]);

  // Organize budgets into three categories
  const organizedBudgets = [
    { name: 'Bills', items: budgets.filter(budget => budget.name === 'Rent' || budget.name === 'Food') },
    { name: 'Wants', items: budgets.filter(budget => budget.name === 'Taxes' || budget.name === 'Emergency Fund') },
    { name: 'Needs', items: budgets.filter(budget => budget.name === 'Vacation' || budget.name === 'LBYM Subscription') },
  ];

  return (
    <div>
      {organizedBudgets.map((budget) => (
        <Budget key={budget.name} budget={budget} />
      ))}
    </div>
  );
}

export default BudgetList;
