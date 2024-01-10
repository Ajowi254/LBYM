// GoalForm.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const GoalForm = ({ show, handleClose, handleAddGoal, categories }) => {
  const [newGoal, setNewGoal] = useState({
    category_id: categories[0].id, // Default to the first category's ID
    goal_amount: '',
    description: '',
    due_date: '',
  });

  const handleChange = (event) => {
    setNewGoal({ ...newGoal, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddGoal(newGoal);
    handleClose(); // to close the modal form
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add a New Goal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              name="category_id"
              value={newGoal.category_id}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Goal Amount</Form.Label>
            <Form.Control
              type="number"
              name="goal_amount"
              value={newGoal.goal_amount}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={newGoal.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              name="due_date"
              value={newGoal.due_date}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add Goal
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default GoalForm;
