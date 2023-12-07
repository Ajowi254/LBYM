import React, { useState } from 'react';
import './budget.css';

function Budget() {
  const initialCategories = [
    {
      name: 'Bills',
      items: [
        { name: 'Rent', budgeted: 0 },
        { name: 'Food', budgeted: 0 },
        { name: 'Water', budgeted: 0 },
      ],
    },
    {
      name: 'Wants',
      items: [
        { name: 'Emergency Fund', budgeted: 0 },
        { name: 'Groceries', budgeted: 0 },
        { name: 'Transportation', budgeted: 0 },
      ],
    },
    {
      name: 'Needs',
      items: [
        { name: 'Vacation', budgeted: 0 },
        { name: 'Dining Out', budgeted: 0 },
        { name: 'LBYM Subscription', budgeted: 0 },
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
