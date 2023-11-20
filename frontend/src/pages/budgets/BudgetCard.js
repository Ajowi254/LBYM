import { useState } from "react";

import FlashMsg from "../../components/FlashMsg";

import Box from "@mui/material/Box";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


function BudgetCard({id, amount=null, category, category_id, edit, add}) {

  const [editAmount, setEditAmount] = useState(amount);
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  }

  const handleChange = (e) => {
    setEditAmount(e.target.value);
  }

  const handleEdit = async(e) => {
    e.preventDefault();
    
    if (amount === null) {
      const addBudget = await add({category_id, amount: +editAmount});
      if(!addBudget.success) {
        setFormError(true);
      } else {
        setSaveStatus(true);
      }
    } else {
      const editBudget = await edit(id, {amount: +editAmount});
      if(!editBudget.success) {
        setFormError(true);
      } else {
        setSaveStatus(true);
      }
    }
    setIsEditing(false);
   
  }

  let jsx = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <TextField value={editAmount} />
      <IconButton onClick={toggleEdit}>
        <EditIcon fontSize="small" />
      </IconButton>
    </Box>
  )

  if(isEditing){
    jsx = (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField onChange={handleChange} value={editAmount} />
        <IconButton onClick={handleEdit}>
          <SaveIcon fontSize="small" />
        </IconButton>
      </Box>
    )
  }

  return (
    <Box className="BudgetCard" sx={{ mt: 2 }}>
      <Typography component="h3" fontWeight="bold" sx={{pr: 1}}>
        {category}    
      </Typography>
      {jsx}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {formError && <FlashMsg type='error' messages={['Please enter a valid number and try again.']} />}
      {saveStatus && <FlashMsg type='success' messages={['Budget saved.']} />}
      </Box>
    </Box>
  )
}

export default BudgetCard;