import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../../context/UserContext';
import CategoryItem from '../../components/CategoryItem';
import { getIconPath } from '../../utils/iconUtils';
import socketIOClient from "socket.io-client";
import './HomeList.css';
import ExpenseBudApi from '../../api/api';
import Nav from '../../components/Nav.js';
import NavWithDrawer from '../../components/NavWithDrawer.js';
import NotificationBanner from '../../components/NotificationBanner.js';

const ENDPOINT = "http://localhost:3001";

function HomeList() {
  const { currentUser } = useContext(UserContext);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndExpenses = async () => {
      const categoriesResponse = await ExpenseBudApi.getCategories();
      const expensesResponse = await ExpenseBudApi.getSumByCategory(currentUser.id);
      const budgetResponse = await ExpenseBudApi.getBudgetByCategory(currentUser.id);

      const updatedCategories = categoriesResponse.map(category => {
        const expenseSum = expensesResponse.find((expense) => Number(expense.category_id) === Number(category.id));
        const budgetSum = budgetResponse.find((budget) => Number(budget.category_id) === Number(category.id));
        const spent = expenseSum ? parseFloat(expenseSum.total) : 0;
        const budget = budgetSum ? parseFloat(budgetSum.total_budget) : 0;
        return { ...category, spent, budget };
      });

      setCategories(updatedCategories);
    };

    fetchCategoriesAndExpenses();

    const socket = socketIOClient(ENDPOINT);

    socket.on('connect', () => {
      console.log('Successfully connected to the server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    socket.on("expenses_updated", data => {
      if (data.userId === currentUser.id) {
        const updatedExpenses = data.expenses.map(expense => {
          const category = categories.find(category => category.id === expense.category_id);
          return { ...category, spent: parseFloat(expense.total) };
        });
        setCategories(updatedExpenses);
      }
    });

    return () => socket.disconnect();
  }, [currentUser, categories]);

  return (
    <div className="home-page">
      <Nav />
      <NotificationBanner /> 
      <div className="category-list">
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
      </div>
      <NavWithDrawer hideAvatar={true} />
    </div>
  );
}

export default HomeList;
