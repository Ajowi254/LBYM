// App.js
import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { decodeToken } from 'react-jwt';

import './App.css';

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

  function logout() {
    setCurrentUser(null);
    setUserToken(null);
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
          const feedbackGiven = localStorage.getItem('feedbackGiven');
          if (!feedbackGiven) {
            setShowFeedbackPopup(true);
          }
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

  const handleFeedbackClose = () => {
    setShowFeedbackPopup(false);
    localStorage.setItem('feedbackGiven', 'true');
  };

  if (!infoLoaded) return <LoadingSpinner />

  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
          <ThemeProvider theme={theme}>
            <NavWithDrawer logout={logout} />
            <Routes register={register} login={login} />
            {showFeedbackPopup && <FeedbackPopup isOpen={showFeedbackPopup} onClose={handleFeedbackClose} />}
          </ThemeProvider>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
