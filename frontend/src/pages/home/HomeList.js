// HomeList.js
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
                // Initialize totalExpenses as an empty object
                let totalExpenses = {};

                try {
                    // Attempt to fetch total expenses by category for the user
                    totalExpenses = await ExpenseBudApi.getTotalExpensesByCategory(currentUser.id);
                } catch (error) {
                    // Log the error and maintain totalExpenses as an empty object
                    console.error('Error fetching total expenses by category:', error);
                }

                // Combine categories with their corresponding total expenses
                const categoriesWithTotalExpenses = categoriesResponse.map(category => ({
                    ...category,
                    spent: totalExpenses[category.id] || 0, // Use 0 if no expenses for the category
                }));

                // Update the state with the combined data
                setCategories(categoriesWithTotalExpenses);
            } catch (error) {
                console.error('Error fetching categories:', error);
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
