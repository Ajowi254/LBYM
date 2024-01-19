//goalslist.js
import React, { useEffect, useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import ExpenseBudApi from "../../api/api";
import GoalsCard from "./GoalsCard"; // Ensure this path is correct
import GoalForm from "./GoalForm"; // Ensure you have this component
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import './GoalsList.css'; // Import your custom CSS

function GoalsList() {
  const { currentUser } = useContext(UserContext);
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const categories = [
    'Groceries', 'Eating Out', 'Shopping', 'Food Delivery', 'Going Out', 'Ride Share'
  ];

  useEffect(() => {
    async function getAllGoals() {
      if (currentUser) {
        try {
          const fetchedGoals = await ExpenseBudApi.getGoals(currentUser.id);
          setGoals(fetchedGoals);
        } catch (error) {
          console.error('Error fetching goals:', error);
        }
      }
    }
    getAllGoals();
  }, [currentUser]);

  const handleAddGoal = async (goalData) => {
    try {
      const newGoal = await ExpenseBudApi.addGoal(currentUser.id, goalData);
      setGoals([...goals, newGoal]);
      setShowForm(false); // Close the form after goal is added
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await ExpenseBudApi.deleteGoal(currentUser.id, goalId);
      setGoals(goals.filter(goal => goal.id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  return (
    <div className="goals-container">
      <Typography component="h1" variant="h5">Goals</Typography>
      <Button
        className="add-goal-button"
        onClick={() => setShowForm(true)}
      >
        + Add
      </Button>
      {showForm && (
        <GoalForm
          show={showForm}
          handleClose={() => setShowForm(false)}
          handleAddGoal={handleAddGoal}
          categories={categories} // Pass the categories array
        />
      )}
      {goals.length > 0 ? (
        goals.map(goal => (
          <GoalsCard 
            key={goal.id}
            goal={goal}
            onDeleteGoal={handleDeleteGoal}
          />
        ))
      ) : (
        <p>No goals yet. Add your first goal!</p>
      )}
    </div>
  );
}

export default GoalsList;