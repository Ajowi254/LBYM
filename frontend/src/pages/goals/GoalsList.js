//goalslist.js
import { useEffect, useState, useContext } from "react";

import UserContext from "../../context/UserContext";
import ExpenseBudApi from "../../api/api";
import GoalsCard from "./GoalsCard";

import Typography from '@mui/material/Typography';
import GoalCard from "./GoalsCard";

function GoalsList() {
  const { currentUser } = useContext(UserContext);
  const [goals, setGoals] = useState([]);

  const editGoal = async(goalId, editData) => {
    try {
      await ExpenseBudApi.updateGoal(currentUser.id, goalId, editData);
      setGoals(goals => goals.map( goal => 
        goal.goal_id === goalId
        ? {...goal, amount: editData }
        : goal ))
      return {success: true};
    } catch (err) {
      return {success: false, err};
    }
  }

  const addGoal = async(addData) => {
    try {
      await ExpenseBudApi.addGoal(currentUser.id, addData);
      setGoals(goals => goals.map( goal => 
        goal.category_id === addData.category_id
        ? {...goal, ...addData}
        : goal));
      return {success: true};
    } catch (err) {
      return {success: false, err};
    }
  } 
  

  useEffect(() => {
    async function getAllGoals() {
      try {
        let goals = await ExpenseBudApi.getAllGoals(currentUser.id);
        setGoals(goals);
      } catch (err) {
        console.error(err);
      }
    }
    getAllGoals();
  }, [])


  return (
    <div>
      <Typography component="h1" variant="h5">
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
      </Typography>
        {goals.map(b => (
          <GoalCard 
            key={b.category} 
            id={b.goal_id}
            amount={b.amount}
            category={b.category}
            category_id={b.category_id} 
            edit={editGoal}
            add={addGoal}
          />
         
        ))}
    </div>
    
    

  )
}


export default GoalsList;