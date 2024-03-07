// Routes.js
import { Route, Switch, Redirect } from 'react-router-dom';

import RegisterForm from '../pages/login-register/RegisterForm';
import LoginForm from '../pages/login-register/LoginForm';
import Dashboard from '../pages/dashboard/Dashboard';
import ProfileForm from '../pages/profile/ProfileForm';
import GoalsList from '../pages/goals/GoalsList';
import AccountList from '../pages/accounts/AccountList';
import HomeList from '../pages/home/HomeList';
import Main from '../components/Main';
import Intro from '../components/Intro';
import Welcome from '../components/Welcome';
import ConnectBank from '../components/ConnectBank'; 
import PrivateRoute from './PrivateRoute';

function Routes({register, login}) {
  return (
    <Switch>
      <Route exact path="/">
        <LoginForm login={login} />
      </Route>

      <Route exact path="/register">
        <RegisterForm register={register} />
      </Route>

      <PrivateRoute exact path="/welcome">
        <Welcome />
      </PrivateRoute>

      <PrivateRoute exact path="/intro">
        <Intro />
      </PrivateRoute>

      <PrivateRoute exact path="/connect-bank">
        <ConnectBank />
      </PrivateRoute>

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

      <Redirect to="/welcome" />
    </Switch>
  )
}

export default Routes;
