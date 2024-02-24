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
import NotificationBanner from './components/NotificationBanner';
import theme from './theme/theme';
import { ThemeProvider } from '@mui/material/styles';

function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [userToken, setUserToken] = useLocalStorage("expensebud_token");
  const [currentUser, setCurrentUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [firstLogin, setFirstLogin] = useLocalStorage("firstLogin", "true");
  const [notifications, setNotifications] = useState([]);
  
  async function register(registerData){
    console.debug("Register function called with data:", registerData);
    try {
      let result = await ExpenseBudApi.register(registerData);
      setUserToken(result);
      setFirstLogin("true");
      console.debug("Register function result:", result);
      return {success: true};
    } catch(err) {
      console.error("Register function error:", err);
      return {success: false, err};
    }
  }
  
  async function login(loginData){
    console.debug("Login function called with data:", loginData);
    try {
      let token = await ExpenseBudApi.login(loginData);
      setUserToken(token);
      console.debug("Login function result:", token);
      return {success: true};
    } catch(err) {
      console.error("Login function error:", err);
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

  useEffect(() => {
    console.debug("App useEffect fetch profile picture");
    async function getProfilePicture() {
      if (userToken) {
        try {
          ExpenseBudApi.token = userToken;
          let { id } = decodeToken(userToken);
          let profileImg = await ExpenseBudApi.getProfilePic(id);
          setCurrentUser((prevUser) => ({ ...prevUser, profileImg }));
        } catch (err) {
          console.error('Error fetching profile picture', err);
        }
      }
    }
    getProfilePicture();
  }, [userToken, setCurrentUser]); 

  useEffect(() => {
    async function fetchNotifications() {
      if (currentUser) {
        const userNotifications = await ExpenseBudApi.getNotifications(currentUser.id);
        setNotifications(userNotifications);
      }
    }
    fetchNotifications();
  }, [currentUser]);
  if (!infoLoaded) return <LoadingSpinner />

  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider value={{currentUser, setCurrentUser}}>
          <ThemeProvider theme={theme}>
            <div style={{ flexGrow: 1, overflow: 'auto' }}>
              <ExpensesContext.Provider value={{ expenses, setExpenses }}>
                <Routes register={register} login={login} />
                <NotificationBanner notifications={notifications} /> {/* Pass notifications to NotificationBanner */}
              </ExpensesContext.Provider>
            </div>
          </ThemeProvider>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  )  
}
export default App;