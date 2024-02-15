// App.js
import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { decodeToken } from 'react-jwt';

import './App.css';
import ExpensesContext from './context/ExpensesContext';
import ExpenseBudApi from './api/api';
import UserContext from './context/UserContext';
import useLocalStorage from './hooks/useLocalStorage';
import Routes from './routes/Routes';
import NavWithDrawer from './components/NavWithDrawer';
import LoadingSpinner from './components/LoadingSpinner';
import theme from './theme/theme';
import FeedbackPopup from './components/FeedbackPopup';
import { ThemeProvider } from '@mui/material/styles';

function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [userToken, setUserToken] = useLocalStorage("expensebud_token");
  const [currentUser, setCurrentUser] = useState(null);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [expenses, setExpenses] = useState([]);

  async function register(registerData){
    try {
      let result = await ExpenseBudApi.register(registerData);
      setUserToken(result);
      return {success: true};
    } catch(err) {
      return {success: false, err};
    }
  }

  async function login(loginData){
    try {
      let token = await ExpenseBudApi.login(loginData);
      setUserToken(token);
      return {success: true};
    } catch(err) {
      return {success: false, err};
    }
  }

  useEffect(() => {
    console.debug("App useEffect load current user");
    
    async function getCurrentUser() {
      if (userToken) {
        try {
          ExpenseBudApi.token = userToken;
          let { id } = decodeToken(userToken);
          let currentUser = await ExpenseBudApi.getCurrentUser(id);
          setCurrentUser(currentUser);
        } catch (err) {
        console.error('Error loading current user', err);
        setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }
    setInfoLoaded(false);
    getCurrentUser();
  }, [userToken]);

  // Add the useEffect hook for fetching the profile picture
  useEffect(() => {
    console.debug("App useEffect fetch profile picture");
    
    async function getProfilePicture() {
      if (userToken) {
        try {
          ExpenseBudApi.token = userToken;
          let { id } = decodeToken(userToken);
          let profileImg = await ExpenseBudApi.getProfilePic(id); // Assuming you have a method to get the profile picture from the database
          setCurrentUser((prevUser) => ({ ...prevUser, profileImg }));
        } catch (err) {
          console.error('Error fetching profile picture', err);
        }
      }
    }
    getProfilePicture();
  }, [userToken, setCurrentUser]); // Run this effect when the userToken or setCurrentUser changes

  if (!infoLoaded) return <LoadingSpinner />

  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider value={{currentUser, setCurrentUser}}>
          <ThemeProvider theme={theme}>
            
            <div style={{ flexGrow: 1, overflow: 'auto' }}>
              <ExpensesContext.Provider value={{ expenses, setExpenses }}>
                <Routes register={register} login={login} />
              </ExpensesContext.Provider>
            </div>
          </ThemeProvider>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  )  
}

export default App;
