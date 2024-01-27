// GoalCard.js
import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { getIconPath } from '../../utils/iconUtils';
import ExpenseBudApi from "../../api/api";

const GoalCard = ({ goal, handleDeleteGoal }) => {
  const [amount, setAmount] = useState(goal.goal_amount);

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
    <Card className="mb-2">
      <Card.Body>
        <Card.Title>
          <img src={getIconPath(goal.category)} alt={goal.category} className="icon" />
          {goal.category}
        </Card.Title>
        <Card.Text>
          Goal: 
          <Form.Control
            type="number"
            value={amount}
            onChange={handleAmountChange}
            onBlur={handleAmountBlur}
            className="goal-amount-input"
          />
          {goal.description && <p>Description: {goal.description}</p>}
        </Card.Text>
        <Button variant="danger" onClick={() => handleDeleteGoal(goal.id)}>
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
};

export default GoalCard;
