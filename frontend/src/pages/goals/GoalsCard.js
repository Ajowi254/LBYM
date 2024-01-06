//goalscard.js
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import FlashMsg from "../../components/FlashMsg";
import { BiCart, BiRestaurant, BiShoppingBag, BiMotorcycle, BiGroup, BiCar } from 'react-icons/bi';

function GoalCard({ id, amount, category, category_id, edit, add }) {
  const [editAmount, setEditAmount] = useState(amount);
  const [formError, setFormError] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);

  const handleSliderChange = (e) => {
    const value = e.target.value;
    setEditAmount(value);
    e.target.style.setProperty('--value', `${value}%`);
  };

  const handleEdit = async(e) => {
    e.preventDefault();
    
    if (amount === null) {
      const addGoal = await add({category_id, amount: +editAmount});
      if(!addGoal.success) {
        setFormError(true);
      } else {
        setSaveStatus(true);
      }
    } else {
      const editGoal = await edit(id, {amount: +editAmount});
      if(!editGoal.success) {
        setFormError(true);
      } else {
        setSaveStatus(true);
      }
    }
  }

  return (
    <div className="goal-card">
      {category === 'Groceries' && <BiCart size={30} />}
      {category === 'Eating Out' && <BiRestaurant size={30} />}
      {/* Add the rest of your icons... */}
      <h5>{category}</h5>
      <Form onSubmit={handleEdit}>
        <Form.Group controlId="formBasicRange">
          <Form.Label>Amount: ${editAmount}</Form.Label>
          <Form.Control type="range" className="slider" value={editAmount} min="0" max="1000" step="10" onChange={handleSliderChange} />
        </Form.Group>
        <Button variant="primary" type="submit" style={{backgroundColor: '#0f766e'}}>
          Save
        </Button>
      </Form>
      {formError && <FlashMsg message="An error occurred while saving." />}
      {saveStatus && <FlashMsg message="Saved successfully." />}
    </div>
  );
}

export default GoalCard;
