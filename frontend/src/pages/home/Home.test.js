import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from 'history';
import { MemoryRouter, Route, Router} from "react-router-dom/cjs/react-router-dom";
import { UserProvider } from "../../testUtils"; 
import Home from "./Home";


it("renders without crashing", () => {
  render(
    <MemoryRouter>
      <UserProvider>
        <Home/>
      </UserProvider>
    </MemoryRouter>
  );
});

it("shows anon-message when no current user", () => {
  const { getByText, queryByText, getByRole } = render(
    <MemoryRouter>
      <UserProvider currentUser={null}>
        <Home/>
      </UserProvider>
    </MemoryRouter>
  );
  expect(getByText('Personal expense tracking & budgeting made simple')).toBeInTheDocument();
  expect(queryByText('Dashboard')).not.toBeInTheDocument();
  expect(getByRole('link')).toHaveAttribute('href', '/register');
});

it("accesses dashboard with current user", () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <UserProvider>
        <Home/>
      </UserProvider>
    </Router>
  );
  expect(screen.queryByText('Personal expense tracking & budgeting made simple')).not.toBeInTheDocument();
  expect(history.location.pathname).toBe('/dashboard');
});