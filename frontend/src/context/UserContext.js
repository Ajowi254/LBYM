// UserContext.js
import React, { useState, useEffect } from 'react';

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  // Other states like accounts, expenses, etc., can be added here

  useEffect(() => {
    // Logic to fetch user data and set the state
    // For example, fetching user info, accounts, and expenses
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
