// HomeList.js
import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../../context/UserContext';
import ExpenseBudApi from '../../api/api';
import Box from '@mui/material/Box';
import CategoryItem from '../../components/CategoryItem';
import { getIconPath } from '../../utils/iconUtils';

function HomeList() {
  const [categories, setCategories] = useState([]);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    async function fetchCategoriesAndBudgets() {
      if (currentUser) {
        // Fetch budgets first to ensure they are available when processing categories
        const budgetsResponse = await ExpenseBudApi.getBudgets(currentUser.id);
        const categoriesResponse = await ExpenseBudApi.getCategories();
        
        // Combine categories with budgets
        const categoriesWithBudgets = categoriesResponse.map(category => ({
          ...category,
          // Find the budget for this category or default to 0
          budget: budgetsResponse.find(b => b.categoryId === category.id)?.budgetLimit || 0
        }));

        setCategories(categoriesWithBudgets);
      }
    }

    fetchCategoriesAndBudgets();
  }, [currentUser]);

  const setBudgetForCategory = (categoryName, newBudget) => {
    setCategories(prevCategories => prevCategories.map(category => {
      if (category.category === categoryName) {
        return { ...category, budget: newBudget };
      }
      return category;
    }));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '500px', margin: 'auto', pt: 0, backgroundColor: '#F9FEFF' }}>
      {categories.map(category => (
        <CategoryItem
          key={category.id}
          icon={getIconPath(category.category)}
          name={category.category}
          initialBudget={category.budget}
          userId={currentUser && currentUser.id}
          categoryId={category.id}
          onBudgetChange={setBudgetForCategory}
        />
      ))}
    </Box>
  );
}

export default HomeList;
