// GoalForm.js
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button } from '@mui/material';
import Select from 'react-select';
import { getIconPath } from '../../utils/iconUtils';
import './GoalForm.css';

const GoalForm = ({ open, handleClose, handleAddGoal, categories }) => {
  const initialGoalState = {
    category_id: '',
    goal_amount: '',
    description: '',
    category: '',
  };

  const [newGoal, setNewGoal] = useState(initialGoalState);

  useEffect(() => {
    if (categories.length > 0) {
      setNewGoal((goal) => ({ ...goal, category_id: categories[0].id.toString(), category: categories[0].category }));
    }
  }, [categories]);

  const handleChange = (event) => {
    setNewGoal({ ...newGoal, [event.target.name]: event.target.value });
  };

  const handleSelectChange = selectedOption => {
    setNewGoal({ ...newGoal, category_id: selectedOption.value, category: selectedOption.label });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const goalData = {
      ...newGoal,
      goal_amount: parseFloat(newGoal.goal_amount),
      category_id: parseInt(newGoal.category_id)
    };
    handleAddGoal(goalData);
    handleClose();
    setNewGoal(initialGoalState); // reset the form fields
  };

  const handleCloseForm = () => {
    handleClose();
    setNewGoal(initialGoalState); // reset the form fields
  };

  const options = categories.map(category => ({
    value: category.id,
    label: category.category,
    icon: getIconPath(category.category),
  }));

  return (
<Dialog open={open} onClose={handleCloseForm}>
  <DialogTitle>Add a New Goal</DialogTitle>
  <DialogContent>
    <form onSubmit={handleSubmit} className="goal-form">
    <Select
  className="goal-form-select" // Changed class name
  name="category_id"
  value={options.find(option => option.value === newGoal.category_id)}
  onChange={handleSelectChange}
  options={options}
  styles={{ menu: base => ({ ...base, position: 'relative' }) }}
/>
<TextField
  className="goal-form-amount" // Changed class name
  type="number"
  name="goal_amount"
  value={newGoal.goal_amount}
  onChange={handleChange}
  label="Goal Amount"
/>
<TextField
   className="goal-form-description" // Changed class name
   type="text"
   name="description"
   value={newGoal.description}
   onChange={handleChange}
   label="Description"
/>
      <Button variant="contained" color="primary" type="submit" className="goal-form button">
        Add Goal
      </Button>
    </form>
  </DialogContent>
</Dialog>

  );
};

export default GoalForm;
