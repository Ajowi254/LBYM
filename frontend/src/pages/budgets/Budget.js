import React, { useState } from 'react';
import './budget.css';
import HouseIcon from '@mui/icons-material/House';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FlightIcon from '@mui/icons-material/Flight';
import ReceiptIcon from '@mui/icons-material/Receipt';

function Budget() {
  const initialCategories = [
    {
      name: 'Bills',
      items: [
        { name: 'Rent', budgeted: 0, icon: <HouseIcon style={{ color: '#3498db' }} /> },
        { name: 'Food', budgeted: 0, icon: <FastfoodIcon style={{ color: '#e74c3c' }} /> },
        { name: 'Water', budgeted: 0 },
      ],
    },
    {
      name: 'Wants',
      items: [
        { name: 'Emergency Fund', budgeted: 0, icon: <MonetizationOnIcon style={{ color: '#f39c12' }} /> },
        { name: 'Groceries', budgeted: 0, icon: <LocalGroceryStoreIcon style={{ color: '#2ecc71' }} /> },
        { name: 'Transportation', budgeted: 0, icon: <DirectionsCarIcon style={{ color: '#3498db' }} /> },
      ],
    },
    {
      name: 'Needs',
      items: [
        { name: 'Vacation', budgeted: 0, icon: <FlightIcon style={{ color: '#3498db' }} /> },
        { name: 'Dining Out', budgeted: 0, icon: <LocalDiningIcon style={{ color: '#9b59b6' }} /> },
        { name: 'LBYM Subscription', budgeted: 0, icon: <ReceiptIcon style={{ color: '#e74c3c' }} /> },
      ],
    },
  ];

  const [categories, setCategories] = useState(initialCategories);
  const [newItem, setNewItem] = useState({ name: '', budgeted: 0 });
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const handleAddClick = (categoryIndex) => {
    setActiveCategoryIndex(categoryIndex);
  };

  const handleAddItem = () => {
    if (activeCategoryIndex !== null) {
      const newCategories = [...categories];
      newCategories[activeCategoryIndex].items.push(newItem);
      setCategories(newCategories);
      setNewItem({ name: '', budgeted: 0 });
      setActiveCategoryIndex(null);
    }
  };

  const handleCancel = () => {
    setNewItem({ name: '', budgeted: 0 });
    setActiveCategoryIndex(null);
    setDeleteConfirmation(false);
  };

  const handleDeleteItem = (categoryIndex, itemIndex) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].items.splice(itemIndex, 1);
    setCategories(newCategories);
  };

  const handleDeleteCategory = (categoryIndex) => {
    setDeleteConfirmation(true);
    setActiveCategoryIndex(categoryIndex);
  };

  const handleDeleteGroupAndCategories = () => {
    if (activeCategoryIndex !== null) {
      const newCategories = [...categories];
      newCategories.splice(activeCategoryIndex, 1);
      setCategories(newCategories);
      setDeleteConfirmation(false);
      setActiveCategoryIndex(null);
    }
  };

  return (
    <div>
      {categories.map((category, categoryIndex) => (
        <section id="budget" key={categoryIndex}>
          <div className="category">
            <div className="categoryName">{category.name}</div>
            <button className="button" onClick={() => handleAddClick(categoryIndex)}>
              +
            </button>
            <button className="button" onClick={() => handleDeleteCategory(categoryIndex)}>
              -
            </button>
          </div>

          {activeCategoryIndex === categoryIndex && !deleteConfirmation && (
            <div>
              <input type="text" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="Name" />
              <input type="number" value={newItem.budgeted} onChange={(e) => setNewItem({ ...newItem, budgeted: parseFloat(e.target.value) })} placeholder="Budgeted" />
              <button onClick={handleAddItem}>Add</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          )}

          {activeCategoryIndex === categoryIndex && deleteConfirmation && (
            <div>
              <p>Are you sure you want to delete this group and its categories?</p>
              <button onClick={handleDeleteGroupAndCategories}>Delete Group & Categories</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          )}

          {category.items.map((item, index) => (
            <div key={index} className="costItem">
              <div className="costItemIcon">{item.icon ? item.icon : null}</div>
              <div className="costItemName">{item.name}</div>
              <button className="button" onClick={() => handleDeleteItem(categoryIndex, index)}>
                -
              </button>
              <div className="budgeted">{item.budgeted}</div>
            </div>
          ))}
        </section>
      ))}

      {/* Delete confirmation overlay */}
      {deleteConfirmation && (
        <div className="delete-confirmation-overlay">
          <div className="delete-confirmation">
            <p>Are you sure you want to delete this group and its categories?</p>
            <button onClick={handleDeleteGroupAndCategories}>Delete Group & Categories</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budget;
