// HomeList.js
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
        setCategories(categoriesData.categories);
      } catch (err) {
        console.error("Error fetching category data:", err);
      }
    }

    fetchCategories();
  }, []);

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '500px', 
      margin: 'auto', 
      pt: 0, // Remove padding top if you want the content to start immediately after the navbar
      backgroundColor: '#F9FEFF' // Set the background color to white or any color you want for the content area
    }}>
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          icon={getIconPath(category.category)} // Assuming your API returns the full path
          name={category.category}
        />
      ))}
    </Box>
  );
}

export default HomeList;
