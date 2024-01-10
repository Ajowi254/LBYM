//homelist.js
import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../../context/UserContext';
import ExpenseBudApi from '../../api/api';
import Box from '@mui/material/Box';
import CategoryItem from '../../components/CategoryItem';
import { getIconPath } from '../../utils/iconUtils';

function HomeList() {
  const { currentUser } = useContext(UserContext);
  const [categories, setCategories] = useState([]);

  // Function to fetch and display categories with aggregated expenses and budgets
  async function fetchCategoriesAndExpenses() {
    if (currentUser) {
      const budgetsResponse = await ExpenseBudApi.getBudgets(currentUser.id);
      const categoriesResponse = await ExpenseBudApi.getCategories();

      // Fetch the aggregated expenses for each category
      const categoriesWithExpenses = await Promise.all(
        categoriesResponse.map(async (category) => {
          const totalSpentResponse = await ExpenseBudApi.getExpensesForCategory(category.id);
          return {
            ...category,
            budget: budgetsResponse.find(b => b.categoryId === category.id)?.budgetLimit || 0,
            spent: totalSpentResponse.total || 0, // Use the aggregated total from the backend
          };
        })
      );

      setCategories(categoriesWithExpenses);
    }
  }

  // Call fetchCategoriesAndExpenses when component mounts or currentUser changes
  useEffect(() => {
    fetchCategoriesAndExpenses();
  }, [currentUser]);

  return (
    <Box sx={{ width: '100%', maxWidth: '500px', margin: 'auto', pt: 0, backgroundColor: '#F9FEFF' }}>
      {categories.map(category => (
        <CategoryItem
          key={category.id}
          icon={getIconPath(category.category)}
          name={category.category}
          budget={category.budget} // Updated to reflect the correct budget amount
          spent={category.spent} // Aggregated spent amount from the backend
          categoryId={category.id} // Included for fetching specific category expenses
        />
      ))}
    </Box>
  );
}

export default HomeList;
