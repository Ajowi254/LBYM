//loginformtest.js
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom/cjs/react-router-dom";
import LoginForm from "./LoginForm";

it("renders without crashing", () => {
  render(
    <MemoryRouter>
      <LoginForm/>
    </MemoryRouter>
  );
});

it("has correct fields and verbiage", () => {
  render(
  <MemoryRouter>
    <LoginForm/>
  </MemoryRouter>
  );
  
  //link to Register
  expect(screen.queryByText("Don't have an account? Register")).toBeInTheDocument();

  //check for text fields
  const usernameField = screen.queryByText("Username");
  expect(usernameField).toBeInTheDocument();
  const firstNameField = screen.queryByText("First Name");
  expect(firstNameField).not.toBeInTheDocument();
});

it("works with form inputs and can be submitted", () => {
  const mockResponse = { success: true };
  const mockLogin = jest.fn(() => Promise.resolve(mockResponse));
  render(
    <MemoryRouter initialEntries={['/login']}>
      <LoginForm login={mockLogin}/>
    </MemoryRouter>
  );

  const usernameInput = screen.getByLabelText(/^username/i);
  const passwordInput = screen.getByLabelText(/^password/i);
  const button = screen.getByRole("button");

  expect(button.textContent).toBe("Login");

  fireEvent.change(usernameInput, { target: { value: 'newuser' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  expect(usernameInput).toHaveValue('newuser');
  expect(passwordInput).toHaveValue('password123');
  fireEvent.click(button);
  expect(mockLogin).toHaveBeenCalled();

});

