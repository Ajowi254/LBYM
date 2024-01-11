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

  async function fetchCategoriesAndExpenses() {
    if (currentUser) {
      const budgetsResponse = await ExpenseBudApi.getBudgets(currentUser.id);
      const categoriesResponse = await ExpenseBudApi.getCategories();
      
      const categoriesWithExpenses = await Promise.all(
        categoriesResponse.map(async (category) => {
          try {
            const expenses = await ExpenseBudApi.getExpensesForCategory(currentUser.id, category.id);
            const totalSpent = expenses.reduce((acc, exp) => acc + exp.amount, 0);
            return {
              ...category,
              budget: budgetsResponse.find(b => b.categoryId === category.id)?.budgetLimit || 0,
              spent: totalSpent,
            };
          } catch (error) {
            console.error(`Error fetching expenses for category ${category.id}:`, error);
            return {
              ...category,
              budget: 0,
              spent: 0,
            };
          }
        })
      );

      setCategories(categoriesWithExpenses);
    }
  }
  
  useEffect(() => {
    fetchCategoriesAndExpenses();
  }, [currentUser]);

  return (
    <Box sx={{ width: '100%', maxWidth: '500px', margin: 'auto', pt: 0, backgroundColor: '#F9FEFF' }}>
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          icon={getIconPath(category.category)}
          name={category.category}
          budget={category.budget}
          spent={category.spent}
          categoryId={category.id}
        />
      ))}
    </Box>
  );
}

export default HomeList;
