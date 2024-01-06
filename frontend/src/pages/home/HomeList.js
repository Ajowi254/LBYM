import React, { useEffect, useState } from "react";
import ExpenseBudApi from "../../api/api";
import Box from '@mui/material/Box';
import CategoryItem from '../../components/CategoryItem';
import { getIconPath } from '../../utils/iconUtils';

function HomeList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await ExpenseBudApi.getCategories();
        setCategories(categoriesData.categories.map(category => ({
          ...category,
          budget: category.budget || 0 // Default budget value if not provided
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
    <Box sx={{ 
      width: '100%', 
      maxWidth: '500px', 
      margin: 'auto', 
      pt: 0, 
      backgroundColor: '#F9FEFF' 
    }}>
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          icon={getIconPath(category.category)}
          name={category.category}
          budget={category.budget}
          onBudgetChange={setBudgetForCategory}
        />
      ))}
    </Box>
  );
}

export default HomeList;
