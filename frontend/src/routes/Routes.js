//routes.js
import { Route, Switch, Redirect } from 'react-router-dom';

import RegisterForm from '../pages/login-register/RegisterForm';
import LoginForm from '../pages/login-register/LoginForm';
import Landing from '../pages/Landing/Landing';
import Dashboard from '../pages/dashboard/Dashboard';
import ProfileForm from '../pages/profile/ProfileForm';
import GoalsList from '../pages/goals/GoalsList';
import AccountList from '../pages/accounts/AccountList';
import HomeList from '../pages/home/HomeList';
import Main from '../components/Main';
import PrivateRoute from './PrivateRoute';

function Routes({register, login}) {
  return (
    <Switch>
      <Route exact path="/">
        <Landing />
      </Route>

      <Route exact path="/register">
        <RegisterForm register={register} />
      </Route>

      <Route exact path="/login">
        <LoginForm login={login} />
      </Route>

      <PrivateRoute exact path="/dashboard">
        <Main>
        <Dashboard />
        </Main>
      </PrivateRoute>

      <PrivateRoute exact path="/goals">
        <Main>
        <GoalsList />
        </Main>
      </PrivateRoute>

      <PrivateRoute exact path="/accounts">
        <Main>
        <AccountList />
        </Main>
      </PrivateRoute>

      <PrivateRoute exact path="/home">
        <Main>
        <HomeList />
        </Main>
      </PrivateRoute>

      <PrivateRoute exact path="/profile">
        <Main>
        <ProfileForm />
        </Main>
      </PrivateRoute>

      <Redirect to="/" />
    </Switch>
  )
}

export default Routes;