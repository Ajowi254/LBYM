//CategoryList.js
import React from 'react';
import CategoryItem from './CategoryItem';
import './CategoryItem.css';

// Assuming categories is an array of category objects
const categories = [
  // Your category objects here
];

function CategoryList() {
  return (
    <div className="category-list">
      {categories.map((category) => (
        <CategoryItem key={category.id} {...category} />
      ))}
    </div>
  );
}

export default CategoryList;
