//homelist.js
import React, { useEffect, useState, useContext } from "react";
// Import UserContext or similar context if you have one
import UserContext from '../../context/UserContext';
import ExpenseBudApi from "../../api/api";
import Box from '@mui/material/Box';
import CategoryItem from '../../components/CategoryItem';
import { getIconPath } from '../../utils/iconUtils';

function HomeList() {
  const [categories, setCategories] = useState([]);
  const { currentUser } = useContext(UserContext); // Assuming you have UserContext

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await ExpenseBudApi.getCategories();
        setCategories(categoriesData.categories.map(category => ({
          ...category,
          budget: category.budget || 0
        })));
      } catch (err) {
        console.error("Error fetching category data:", err);
      }
    }
    fetchCategories();
  }, []);

  const setBudgetForCategory = (categoryName, newBudget) => {
    setCategories(categories.map(category => {
      if (category.category === categoryName) {
        return { ...category, budget: newBudget };
      }
      return category;
    }));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '500px', margin: 'auto', pt: 0, backgroundColor: '#F9FEFF' }}>
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          icon={getIconPath(category.category)}
          name={category.category}
          budget={category.budget}
          userId={currentUser && currentUser.id} // Use the ID from the current user context
          categoryId={category.id}
          onBudgetChange={setBudgetForCategory}
        />
      ))}
    </Box>
  );
}

export default HomeList;

