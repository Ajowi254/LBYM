//expenseform.js
import { useState } from "react";

import FlashMsg from "../../components/FlashMsg";
import errorMap from "../../utils/errorMap";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from "@mui/material/MenuItem";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const INITIAL_STATE = {
  amount: '',
  vendor: '',
  description: '',
  category_id: '',
  date: ''
}
const maxDate = new Date(); // Set the maximum date to today's date
const maxDateString = maxDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format

const categoryOptions = [
  { value: 1, label: 'Entertainment' },
  { value: 2, label: 'Food & Drink' },
  { value: 3, label: 'Medical' },
  { value: 4, label: 'Rent & Utilities' },
  { value: 5, label: 'Transportation'},
  { value: 6, label: 'Travel'},
  { value: 7, label: 'Other'}
]

function ExpenseForm({add}) {
  const [formData, setFormData] = useState(INITIAL_STATE); 
  const [formErrors, setFormErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData(data => ({...data, [name]: value}));
    setFormErrors([]);
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    formData.amount = +formData.amount;
    const addResult = await add(formData);
    if(addResult.success){
      setFormData(INITIAL_STATE);
      setFormErrors({});
      setSaveStatus(true);
    } else {
      let errors = errorMap(addResult.err);
      setFormErrors(errors);
    }
    }


  return (
    <div>
      <Typography variant="subtitle1">
        Add a new transaction in the form below: 
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: 450 }}>
        <TextField
          margin="dense"
          autoFocus
          fullWidth
          required
          size="small"
          id="amount"
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          error={formErrors.amount}
          helperText={formErrors.amount? 'Amount needs to be a number': null}
        />
        <TextField
          select
          fullWidth
          required
          margin="dense"
          size="small"
          id="category"
          label="Select a category"
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
        >
          {categoryOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          required
          margin="dense"
          size="small"
          id="vendor"
          label="Vendor"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          error={formErrors.vendor}
          helperText={formErrors.vendor? 'Vendor cannot be blank': null}
        />
        <TextField
          fullWidth
          required
          margin="dense"
          size="small"
          name="date"
          label="Date"
          type="date"
          id="date"
          inputProps={{
            max: maxDateString, // Set the maximum date
          }}
          InputLabelProps={{
            shrink: true,
          }}
          value={formData.date}
          onChange={handleChange}
          error={formErrors.date}
          helperText={formErrors.date? 'Invalid date': null}
        />
        <TextField
          fullWidth
          margin="dense"
          size="small"
          id="description"
          label="Description (optional)"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 1, mb: 2 }}
        >
          Add
        </Button>
      </Box>
      {saveStatus && <FlashMsg type='success' messages={['Expense added!']} />}
    </div>
  ) 
}

export default ExpenseForm;