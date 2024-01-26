// HomeList.js

import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../../context/UserContext';
import Box from '@mui/material/Box';
import CategoryItem from '../../components/CategoryItem';
import { getIconPath } from '../../utils/iconUtils';
import io from 'socket.io-client';
import ExpenseBudApi from '../../api/api';

const socket = io('http://localhost:3001');
console.log('Socket connected:', socket.connected)

function HomeList() {
  const { currentUser } = useContext(UserContext);
  const [categories, setCategories] = useState([]);

  const fetchCategoriesAndExpenses = async () => {
    if (currentUser) {
      try {
        const categoriesResponse = await ExpenseBudApi.getCategories();
        console.log('Fetched categories:', categoriesResponse);
        const expensesResponse = await ExpenseBudApi.getSumByCategory(currentUser.id);
        console.log('Fetched expenses:', expensesResponse);
        const categoriesWithExpenses = categoriesResponse.map((category) => {
          const expense = expensesResponse.expenses ? expensesResponse.expenses.find((expense) => Number(expense.category_id) === Number(category.id)) : null;
          return {
            ...category,
            spent: expense?.total || 0,
          };
        });
        

        console.log('Setting categories state:', categoriesWithExpenses);
        setCategories(categoriesWithExpenses);
      } catch (error) {
        console.error('Error fetching categories or expenses:', error);
      }
    }
  };

  useEffect(() => {
    console.log('Running useEffect');
    fetchCategoriesAndExpenses();

    socket.on('expenses_updated', () => {
      console.log('expenses_updated event received');
      fetchCategoriesAndExpenses();
    });

    return () => socket.off('expenses_updated');
  }, [currentUser]);

  console.log('Rendering HomeList with categories:', categories);

  return (
    <Box sx={{ width: '100%', maxWidth: '500px', margin: 'auto', pt: 0, backgroundColor: '#F9FEFF' }}>
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          icon={getIconPath(category.category)}
          name={category.category}
          budget={category.budget || 0}
          spent={category.spent}
          categoryId={category.id}
        />
      ))}
    </Box>
  );
}

export default HomeList;
