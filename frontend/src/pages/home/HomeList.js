//homelist.js
import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../../context/UserContext';
import ExpenseBudApi from '../../api/api';
import Box from '@mui/material/Box';
import CategoryItem from '../../components/CategoryItem';
import { getIconPath } from '../../utils/iconUtils';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function HomeList() {
  const { currentUser } = useContext(UserContext);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
      async function fetchCategoriesAndTotalExpenses() {
          if (currentUser) {
              try {
                  const categoriesResponse = await ExpenseBudApi.getCategories();
                  const totalExpensesResponse = await ExpenseBudApi.getTotalExpensesByCategory(currentUser.id);
                  
                  const categoriesWithTotalExpenses = categoriesResponse.map(category => ({
                      ...category,
                      spent: totalExpensesResponse[category.id] || 0,
                  }));

                  setCategories(categoriesWithTotalExpenses);
              } catch (error) {
                  console.error('Error fetching categories and expenses:', error);
              }
          }
      }

      fetchCategoriesAndTotalExpenses();
  }, [currentUser]);

  return (
    <Box sx={{ width: '100%', maxWidth: '500px', margin: 'auto', pt: 0, backgroundColor: '#F9FEFF' }}>
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          icon={getIconPath(category.category)}
          name={category.category}
          budget={category.budget || 0} // Set a default budget or fetch it if necessary
          spent={category.spent}
          categoryId={category.id}
        />
      ))}
    </Box>
  );
}

export default HomeList;
