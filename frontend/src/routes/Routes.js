import { Route, Switch, Redirect } from 'react-router-dom';

import RegisterForm from '../pages/login-register/RegisterForm';
import LoginForm from '../pages/login-register/LoginForm';
import Home from '../pages/home/Home';
import Dashboard from '../pages/dashboard/Dashboard';
import ProfileForm from '../pages/profile/ProfileForm';
import BudgetList from '../pages/budgets/BudgetList';
import AccountList from '../pages/accounts/AccountList';
import ExpenseList from '../pages/expenses/ExpenseList';
import Main from '../components/Main';
import PrivateRoute from './PrivateRoute';

function Routes({register, login}) {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
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

      <PrivateRoute exact path="/budgets">
        <Main>
        <BudgetList />
        </Main>
      </PrivateRoute>

      <PrivateRoute exact path="/accounts">
        <Main>
        <AccountList />
        </Main>
      </PrivateRoute>

      <PrivateRoute exact path="/expenses">
        <Main>
        <ExpenseList />
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