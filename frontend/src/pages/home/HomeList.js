// HomeList.js
import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../../context/UserContext';
import Box from '@mui/material/Box';
import CategoryItem from '../../components/CategoryItem';
import { getIconPath } from '../../utils/iconUtils';
import './HomeList.css'; // Import the CSS file
import ExpenseBudApi from '../../api/api';
import io from 'socket.io-client';
import Nav from '../../components/Nav.js';
import NavWithDrawer from '../../components/NavWithDrawer.js'; // Import the NavWithDrawer component

const socket = io('http://localhost:3001');
console.log('Socket connected:', socket.connected)

function HomeList() {
  const { currentUser } = useContext(UserContext);
  const [categories, setCategories] = useState([]);

  const fetchCategoriesAndExpenses = async () => {
    if (currentUser) {
      try {
        const categoriesResponse = await ExpenseBudApi.getCategories();
        console.log('Categories response:', categoriesResponse);
        const expensesResponse = await ExpenseBudApi.getSumByCategory(currentUser.id);
        console.log('Expenses response:', expensesResponse);
        let processedCategories = []; // Use a new variable to hold the processed categories
        for (let category of categoriesResponse) {
          const expense = expensesResponse.expenses ? expensesResponse.expenses.find((expense) => Number(expense.category_id) === Number(category.id)) : null;
          if (!expense) {
            console.log(`No matching expense found for category ${category.id}`);
          }
          console.log('Spent for category:', category.id, ':', expense?.total || 0);
          // Ensure the spent value is a number
          const spent = expense ? parseFloat(expense.total) : 0;
          processedCategories.push({
            ...category,
            spent,
          });
        }
        console.log('Processed categories:', processedCategories);
        setCategories(processedCategories);
        console.log('Updated categories state:', processedCategories); // Log the local variable instead of the state
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
    <div className="home-page">
      <Nav /> 
      {categories.map((category) => {
        console.log(`Rendering CategoryItem for category ${category.id} with spent value: ${category.spent}`);
        return (
          <CategoryItem
            key={category.id}
            icon={getIconPath(category.category)}
            name={category.category}
            budget={category.budget || 0}
            spent={category.spent}
            categoryId={category.id}
          />
        );
      })}
      <NavWithDrawer hideAvatar={true} /> 
    </div>
  );
}

export default HomeList;
