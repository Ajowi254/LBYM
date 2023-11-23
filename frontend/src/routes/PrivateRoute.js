//privateroute.js
import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";

import UserContext from "../context/UserContext";

const PrivateRoute = ({children, exact, path}) => {
  const {currentUser} = useContext(UserContext);
  console.debug('PrivateRoute', 'current user=', currentUser)

  if (!currentUser) {
    return <Redirect to='/login' />
  }
 
  return (
    <Route exact={exact} path={path}>
      {children}
    </Route>
  )
}

export default PrivateRoute;