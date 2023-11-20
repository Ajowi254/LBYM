import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { UserProvider } from "../testUtils";
import Nav from "./Nav";

it("renders without crashing", () => {
  render(
    <MemoryRouter>
      <UserProvider>
        <Nav/>
      </UserProvider>
    </MemoryRouter>
  );
});

it("matches snapshot", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <UserProvider>
        <Nav/>
      </UserProvider>
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("matches snapshot when logged out", () => {
  const { asFragment} = render(
    <MemoryRouter>
      <UserProvider currentUser={null}>
        <Nav/>
      </UserProvider>
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("shows login and register when no current user", () => {
  const { getByText, queryByText } = render(
    <MemoryRouter>
      <UserProvider currentUser={null}>
        <Nav/>
      </UserProvider>
    </MemoryRouter>
  );
  expect(getByText('Login')).toBeInTheDocument();
  expect(getByText('Register')).toBeInTheDocument();
  expect(queryByText('Logout')).not.toBeInTheDocument();
});

it("should have /login attribute as href on Login button", () => {
  render (
    <MemoryRouter>
      <UserProvider currentUser={null}>
        <Nav/>
      </UserProvider>
    </MemoryRouter>
  );
  expect(screen.getByRole('link', {name: 'Login'})).toHaveAttribute('href', '/login');
});

it("should have /register attribute as href on Register button", () => {
  render (
    <MemoryRouter>
      <UserProvider currentUser={null}>
        <Nav/>
      </UserProvider>
    </MemoryRouter>
  );
  expect(screen.getByRole('link', {name: 'Register'})).toHaveAttribute('href', '/register');
});