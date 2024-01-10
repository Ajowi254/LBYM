// GoalCard.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { getIconPath } from '../../utils/iconUtils';

const GoalCard = ({ goal, handleDeleteGoal }) => {
  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Title>
          <img src={getIconPath(goal.category)} alt={goal.category} className="icon" />
          {goal.category}
        </Card.Title>
        <Card.Text>
          Goal: ${goal.goal_amount}
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
