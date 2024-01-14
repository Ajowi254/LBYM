// HomeList.js
import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../../context/UserContext';
import ExpenseBudApi from '../../api/api'; // Make sure to import the API correctly
import Box from '@mui/material/Box';
import CategoryItem from '../../components/CategoryItem';
import { getIconPath } from '../../utils/iconUtils';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Ensure this is your actual server address

function HomeList({ updatedExpenses }) { // Receive updated expenses as a prop
  const { currentUser } = useContext(UserContext);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategoriesAndExpenses() {
      if (currentUser) {
        try {
          const categoriesResponse = await ExpenseBudApi.getCategories();
          let totalExpenses = {};
          try {
           
          totalExpenses = await ExpenseBudApi.getAggregatedExpensesByCategory(currentUser.id);

          } catch (error) {
            console.error('Error fetching aggregated expenses:', error);
          }
    
          const categoriesWithExpenses = categoriesResponse.map(category => ({
            ...category,
            spent: totalExpenses[category.id] || 0,
          }));
    
          setCategories(categoriesWithExpenses);
        } catch (error) {
          console.error('Error fetching categories and expenses:', error);
        }
      }
    }
    
    fetchCategoriesAndExpenses();
  }, [currentUser, updatedExpenses]); // Depend on updatedExpenses prop

  // Listen to socket events if needed
  useEffect(() => {
    socket.on('expenses_updated', (data) => {
      // Handle the event
    });

    // Clean up the effect
    return () => socket.off('expenses_updated');
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: '500px', margin: 'auto', pt: 0, backgroundColor: '#F9FEFF' }}>
      {categories.map(category => (
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
