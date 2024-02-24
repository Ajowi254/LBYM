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
import Nav from '../../components/Nav.js';
import NavWithDrawer from '../../components/NavWithDrawer.js';

function GoalsList() {
  const { currentUser } = useContext(UserContext);
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);

  // Add a loading state
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log('Running useEffect in GoalsList');
    async function getAllGoals() {
      if (currentUser) {
        try {
          const fetchedGoals = await ExpenseBudApi.getGoals(currentUser.id);
          const fetchedCategories = await ExpenseBudApi.getCategories();
          console.log('Fetched categories:', fetchedCategories);
          setCategories(fetchedCategories);

          // Add the category to each goal object
          const goalsWithCategory = fetchedGoals.map(goal => {
            const category = fetchedCategories.find(category => category.id === goal.category_id);
            return { ...goal, category: category.category };
          });
          console.log('Fetched goals:', goalsWithCategory);
          setGoals(goalsWithCategory);
        } catch (error) {
          console.error('Error fetching goals:', error);
        }
      }
      // Set loading to false once the data has been fetched
      setLoading(false);
    }
    getAllGoals();
  }, [currentUser]);

  const handleAddGoal = async (goalData) => {
    console.log('Adding goal:', goalData);
    try {
      const category = categories.find(category => category.id === goalData.category_id);
      const newGoal = await ExpenseBudApi.addGoal(currentUser.id, { ...goalData, category: category.category });
      if (newGoal) {
        setGoals((goals) => {
          const newGoals = [...goals, { ...newGoal, category: category.category }];
          console.log('Updated goals:', newGoals);
          return newGoals;
        });
        setShowForm(false);
      } else {
        console.error('No goal returned from addGoal function');
      }
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };
  
  const handleDeleteGoal = async (goalId) => {
    console.log('Deleting goal with id:', goalId);
    try {
      await ExpenseBudApi.deleteGoal(currentUser.id, goalId);
      setGoals((goals) => goals.filter((goal) => goal.id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };
  
  // Only render GoalsCard components once the data has been fetched
  return (
    <>
      <div className="header">
      <Nav />
        <Typography component="h1" variant="h5">SPENDING</Typography>
        <Button
          className="add-goal-button"
          onClick={() => setShowForm(true)}
        >
          + Add
        </Button>
      </div>
      <GoalForm
        open={showForm}
        handleClose={() => setShowForm(false)}
        handleAddGoal={handleAddGoal}
        categories={categories}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        goals.length > 0 ? (
          goals.map((goal) => (
            <GoalsCard 
              key={goal.id}
              goal={goal}
              handleDeleteGoal={handleDeleteGoal}
            />
          ))
        ) : (
          <p>No goals yet.</p>
        )
      )}
      <NavWithDrawer hideAvatar={true} /> 
    </>
  );
}

export default GoalsList;
