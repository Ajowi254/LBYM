//homelist.js
import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../../context/UserContext';
import CategoryItem from '../../components/CategoryItem';
import { getIconPath } from '../../utils/iconUtils';
import './HomeList.css';
import ExpenseBudApi from '../../api/api';
import Nav from '../../components/Nav.js';
import NavWithDrawer from '../../components/NavWithDrawer.js';

function HomeList() {
  const { currentUser } = useContext(UserContext);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndExpenses = async () => {
      const categoriesResponse = await ExpenseBudApi.getCategories();
      const expensesResponse = await ExpenseBudApi.getSumByCategory(currentUser.id);
      const budgetResponse = await ExpenseBudApi.getBudgetByCategory(currentUser.id); // Fetch the total budget for each category

      const updatedCategories = categoriesResponse.map(category => {
        const expenseSum = expensesResponse.find((expense) => Number(expense.category_id) === Number(category.id));
        const budgetSum = budgetResponse.find((budget) => Number(budget.category_id) === Number(category.id)); // Find the budget for the current category
        const spent = expenseSum ? parseFloat(expenseSum.total) : 0;
        const budget = budgetSum ? parseFloat(budgetSum.total_budget) : 0; // Get the total budget for the current category
        return { ...category, spent, budget }; // Include budget in the returned object
      });

      setCategories(updatedCategories);
    };

    fetchCategoriesAndExpenses();
  }, [currentUser]);

  return (
    <div className="home-page">
      <Nav />
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          icon={getIconPath(category.category)}
          name={category.category}
          budget={category.budget || 0}
          spent={category.spent}
          categoryId={category.id}
        />
      ))}
      <NavWithDrawer hideAvatar={true} />
    </div>
  );
}

export default HomeList;
