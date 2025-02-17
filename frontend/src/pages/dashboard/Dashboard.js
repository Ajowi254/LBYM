// Dashboard.js
import { useState, useEffect, useContext } from 'react';
import UserContext from "../../context/UserContext";
import ExpenseBudApi from '../../api/api';
import BarChart from "../../components/BarChart";
import PieChart from '../../components/PieChart';
import LoadingSpinner from '../../components/LoadingSpinner';
import FlashMsg from '../../components/FlashMsg';
import FeedbackPopup from '../../components/FeedbackPopup'; // Import the FeedbackPopup component
import { groupAndAggregateData, goalByCategory } from '../../utils/aggregateData';
import Nav from '../../components/Nav.js';
import NavWithDrawer from '../../components/NavWithDrawer.js';
import './Dashboard.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NotificationBanner from '../../components/NotificationBanner.js';

function Dashboard() {
  const { currentUser } = useContext(UserContext);
  const [expenses, setExpenses] = useState([]);
  const [goals, setBudgets] = useState([]);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [loadingErrors, setLoadingErrors] = useState([]);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [barData, setBarData] = useState({ labels: '', datasets: [] });
  const [pieData, setPieData] = useState({ labels: '', datasets: [] });

  useEffect(() => {
    async function getAllExpenses() {
      try {
        let expenses = await ExpenseBudApi.getAllExpenses(currentUser.id);
        setExpenses(expenses);
      } catch (err) {
        setLoadingErrors(err);
        console.error(err);
      }
      setInfoLoaded(true);
    }

    async function getAllBudgets() {
      try {
        let goals = await ExpenseBudApi.getAllBudgets(currentUser.id);
        setBudgets(goals);
      } catch (err) {
        setLoadingErrors(err);
        console.error(err);
      }
      setInfoLoaded(true);
    }

    setInfoLoaded(false);
    setLoadingErrors([]);
    getAllExpenses();
    getAllBudgets();
  }, []);

  const handleFeedbackClose = () => {
    setFeedbackOpen(false);
  };

  useEffect(() => {
    const hasGivenFeedback = localStorage.getItem('hasGivenFeedback');
    const hasSubmittedFeedback = localStorage.getItem('hasSubmittedFeedback');
    const hasSeenFeedbackPopup = localStorage.getItem('hasSeenFeedbackPopup');

    if (!hasSeenFeedbackPopup && !hasSubmittedFeedback) {
      setFeedbackOpen(true);
    }
    if (!hasGivenFeedback) {
      setFeedbackOpen(true);
    }
  }, []);

  useEffect(() => {
    const aggregatedExpenses = groupAndAggregateData(expenses);
    const aggregatedBudgets = goalByCategory(goals);
    const datasets = [
      {
        label: 'Expense',
        data: aggregatedExpenses.map((expense) => expense.amount),
        backgroundColor: ['#5FA8D3', '#F9C74F', '#43AA8B', '#6a4c93', '#F94144', '#F8961E', '#B0BBBF'],
      },
      {
        label: 'Budget',
        data: aggregatedExpenses.map((expense) => aggregatedBudgets[expense.category]),
        borderColor: ['#5FA8D3', '#F9C74F', '#43AA8B', '#6a4c93', '#F94144', '#F8961E', '#B0BBBF'],
        borderWidth: 3,
      },
    ];
    const barData = {
      labels: aggregatedExpenses.map((expense) => expense.category),
      datasets: datasets,
    };
    const pieData = {
      labels: aggregatedExpenses.map((expense) => expense.category),
      datasets: [datasets[0]],
    };

    setBarData(barData);
    setPieData(pieData);
  }, [expenses, goals]);

  const handleFeedbackSubmit = (selectedOption) => {
    setFeedbackOpen(false);
    localStorage.setItem('hasSeenFeedbackPopup', 'true');
    // If you have backend logic, make an API call here
    // For simplicity, we're just closing the feedback popup
    localStorage.setItem('hasSubmittedFeedback', 'true');
  };

  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <div className="Dashboard">
       <Nav />
       <NotificationBanner /> 
      <Typography component="h1" variant="h5">
        Dashboard
      </Typography>
      {loadingErrors && <FlashMsg type="error" messages={loadingErrors} />}
      {(expenses.length && goals.length) ? (
        <>
          <div className="Dashboard-row">
            <div className="Dashboard-bar">
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Expenses / Budgets Comparison
              </Typography>
              <BarChart chartData={barData}></BarChart>
            </div>
            <div className="Dashboard-pie">
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Expense Distribution
              </Typography>
              <PieChart chartData={pieData}></PieChart>
            </div>
          </div>
          <div className="Dashboard-table">
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Most Recent Expenses
            </Typography>
         
          </div>
        </>
      ) : (
        <>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Welcome {currentUser.firstName}!
            </Typography>
            <Typography variant="body1" gutterBottom>
              There is no data yet to display on the dashboard. Here is how to get started: <br />
              <ol>
                <li>
                  Add expense transactions:
                  <ul>
                    <li>Link a bank account and sync your credit card transactions in the Accounts tab.</li>
                    AND/OR
                    <li>Enter transactions manually in the Expenses tab.</li>
                  </ul>
                </li>
                <li>Set up goals for each category in the Budgets tab.</li>
                <li>View the dashboard!</li>
              </ol>
            </Typography>
          </Box>
        </>
      )}
      <FeedbackPopup open={feedbackOpen} onClose={handleFeedbackClose} onSubmit={handleFeedbackSubmit} />
      <NavWithDrawer hideAvatar={true} /> 
    </div>
  );
}

export default Dashboard;
