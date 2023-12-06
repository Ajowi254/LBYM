//budget.js
import React, { useState } from 'react';
import './budget.css'; 
import FlashMsg from "../../components/FlashMsg";

import Box from "@mui/material/Box";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

function Budget() {
  const [categories, setCategories] = useState([
    { name: 'Bills', items: [{ name: 'Rent', budgeted: 12563.23, available: 0 }, { name: 'Food', budgeted: 0, available: 0 }] },
    { name: 'Needs', items: [{ name: 'Emergency Fund', budgeted: 10000, available: 0 }, { name: 'Taxes', budgeted: 2000, available: 0 }] },
    { name: 'Wants', items: [{ name: 'LBYM Subscription', budgeted: 155, available: 0 }, { name: 'Vacation', budgeted: 2000, available: 0 }] },
  ]);

  const [newItem, setNewItem] = useState({ name: '', budgeted: 0 }); // State for storing the new item name and budgeted amount
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(null); // State for storing the active category index

  // Function for handling the "+" button click
  const handleAddClick = (categoryIndex) => {
    setActiveCategoryIndex(categoryIndex);
  };

  // Function for handling the "Add" button click in the add item form
  const handleAddItem = () => {
    const newCategories = [...categories];
    newCategories[activeCategoryIndex].items.push(newItem);
    setCategories(newCategories);
    setNewItem({ name: '', budgeted: 0 });
    setActiveCategoryIndex(null);
  };

  // Function for handling the "Cancel" button click in the add item form
  const handleCancel = () => {
    setNewItem({ name: '', budgeted: 0 });
    setActiveCategoryIndex(null);
  };

  return (
    <div>
      {categories.map((category, categoryIndex) => (
        <section id="budget" key={categoryIndex}>
          <div className="category">
            <div className="categoryName">{category.name}</div>
            <button className="button" onClick={() => handleAddClick(categoryIndex)}>+</button>
          </div>

          {/* Render existing items */}
          {category.items.map((item, index) => (
            <div key={index} className="costItem">
              <input type="checkbox" />
              <div className="costItemName">{item.name}</div>
              <div className="budgeted">{item.budgeted}</div>
              <div className="available">{item.available}</div>
            </div>
          ))}

          {/* Add item form */}
          {activeCategoryIndex === categoryIndex && (
            <div>
              <input type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="Name" />
              <input type="number" value={newItem.budgeted} onChange={e => setNewItem({ ...newItem, budgeted: parseFloat(e.target.value) })} placeholder="Budgeted" />
              <button onClick={handleAddItem}>Add</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

export default Budget;
