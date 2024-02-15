// GoalsCard.js
import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { getIconPath } from '../../utils/iconUtils';
import ExpenseBudApi from "../../api/api";
import './GoalsCard.css';
import useLocalStorage from '../../hooks/useLocalStorage';

const GoalsCard = ({ goal, handleDeleteGoal }) => {
  const [amount, setAmount] = useLocalStorage(`goal-${goal.id}`, goal.goal_amount);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleAmountBlur = async () => {
    try {
      await ExpenseBudApi.updateGoal(goal.user_id, goal.id, { goal_amount: amount });
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  return (
    <div className="goal-card">
      <div className="goal-title-icon">
        <div className="goal-title">{goal.category}</div>
        <img src={getIconPath(goal.category)} alt={goal.category} className="icon" />
      </div>
      <div className="goal-details">
      <Form.Control
  className="goal-amount-box"
  type="text"
  value={`$${amount}`}
  onChange={event => handleAmountChange(event.target.value.slice(1))}
  onBlur={handleAmountBlur}
/>
{goal.description && <p className="description-text">Description: {goal.description}</p>}
      </div>
      <Button className="delete-button" onClick={() => handleDeleteGoal(goal.id)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </Button>
    </div>
  );
};

export default GoalsCard;
