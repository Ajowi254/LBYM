//goalslist.js
import React, { useEffect, useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import ExpenseBudApi from "../../api/api";
import GoalsCard from "./GoalsCard";
import GoalForm from "./GoalForm";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import './GoalsList.css';
import { getIconPath } from '../../utils/iconUtils';

function GoalsList() {
  const { currentUser } = useContext(UserContext);
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function getAllGoals() {
      if (currentUser) {
        try {
          const fetchedGoals = await ExpenseBudApi.getGoals(currentUser.id);
          setGoals(fetchedGoals);
          const fetchedCategories = await ExpenseBudApi.getCategories();
          console.log('Fetched categories:', fetchedCategories); // Add this line
          setCategories(fetchedCategories);
        } catch (error) {
          console.error('Error fetching goals:', error);
        }
      }
    }
    getAllGoals();
  }, [currentUser]);

  const handleAddGoal = async (goalData) => {
    try {
      const category = categories.find(category => category.id === goalData.category_id);
      const newGoal = await ExpenseBudApi.addGoal(currentUser.id, { ...goalData, category: category.category });
      if (newGoal) {
        setGoals((goals) => [...goals, newGoal]);
        setShowForm(false);
      } else {
        console.error('No goal returned from addGoal function');
      }
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };
  
  
  const handleDeleteGoal = async (goalId) => {
    try {
      await ExpenseBudApi.deleteGoal(currentUser.id, goalId);
      setGoals((goals) => goals.filter((goal) => goal.id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };
  
  return (
    <>
      <div className="header">
        <Typography component="h1" variant="h5">SPENDING</Typography>
        <Button
          className="add-goal-button"
          onClick={() => setShowForm(true)}
        >
          + Add
        </Button>
      </div>
      {showForm && (
        <GoalForm
          show={showForm}
          handleClose={() => setShowForm(false)}
          handleAddGoal={handleAddGoal}
          categories={categories}
        />
      )}
       {goals.length > 0 ? (
      goals.map((goal) => (
        <GoalsCard 
          key={goal.id}
          goal={goal}
          handleDeleteGoal={handleDeleteGoal} // Pass handleDeleteGoal as a prop named 'handleDeleteGoal'
        />
      ))
    ) : (
      <p>No goals yet.</p>
    )}
    </>
  );
}

export default GoalsList;
