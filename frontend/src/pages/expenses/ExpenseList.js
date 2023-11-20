import { useEffect, useState, useContext } from "react";

import UserContext from "../../context/UserContext";
import ExpenseBudApi from "../../api/api";
import ExpenseTable from "./ExpenseTable";
import ExpenseForm from "./ExpenseForm";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function ExpenseList() {
  const { currentUser } = useContext(UserContext);
  const [expenses, setExpenses] = useState([]);
  
  async function getAllExpenses() {
    try {
      let expenses = await ExpenseBudApi.getAllExpenses(currentUser.id);
      setExpenses(expenses);
    } catch (err) {
      console.error(err);
    }
  }

  const addExpense = async(newExpense) => {
    try {
      await ExpenseBudApi.addExpense(currentUser.id, newExpense);
      getAllExpenses();
      return {success: true};
    } catch (err) {
      return {success: false, err};
    }
  } 
  // future implementation
  // const editExpense = async(editData) => {
  //   try {
  //     await ExpenseBudApi.editExpense(currentUser.id, editData);
  //     getAllExpenses();
  //     return {success: true};
  //   } catch (err) {
  //     return {success: false, err};
  //   }
  // }
  const deleteExpense = async(expenseId) => {
    try {
      await ExpenseBudApi.deleteExpense(currentUser.id, expenseId);
      getAllExpenses();
      return {success: true};
    } catch (err) {
      return {success: false, err};
    }
  }

  useEffect(() => {
    getAllExpenses();
  }, [])

  return (
    <div>
      <Typography component="h1" variant="h5">
        Expenses
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column',  justifyContent: 'center', alignItems: 'center'}}> 
        <ExpenseForm add={addExpense}/>
        {expenses.length
        ? (<ExpenseTable data={expenses} deleteExpense={deleteExpense} />)
        : <h3>There are currently no expense transactions.</h3>
        }
      </Box>
    </div>
  )
}



export default ExpenseList;