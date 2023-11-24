//registerform.test.js
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom/cjs/react-router-dom";
import RegisterForm from "./RegisterForm";

it("renders without crashing", () => {
  render(
    <MemoryRouter>
      <RegisterForm/>
    </MemoryRouter>
  );
});

it("has correct fields and verbiage", () => {
  render(
  <MemoryRouter>
    <RegisterForm/>
  </MemoryRouter>
  );
  
  //link to Login
  expect(screen.queryByText("Already have an account? Login")).toBeInTheDocument();

  //check for text fields
  const usernameField = screen.queryByText("Username");
  expect(usernameField).toBeInTheDocument();
  const firstNameField = screen.queryByText("First Name");
  expect(firstNameField).toBeInTheDocument();
  const emailField = screen.queryByText("Email Address");
  expect(emailField).toBeInTheDocument();
});

it("works with form inputs and can be submitted", () => {
  const mockResponse = { success: true };
  const mockRegister = jest.fn(() => Promise.resolve(mockResponse));
  render(
    <MemoryRouter initialEntries={['/register']}>
      <RegisterForm register={mockRegister}/>
    </MemoryRouter>
  );

  const firstNameInput = screen.getByLabelText(/^First Name/i);
  const lastNameInput = screen.getByLabelText(/^Last Name/i);
  const usernameInput = screen.getByLabelText(/^username/i);
  const passwordInput = screen.getByLabelText(/^password/i);
  const emailInput = screen.getByLabelText(/^email/i);
  const button = screen.getByRole("button");

  expect(button.textContent).toBe("Register");

  fireEvent.change(firstNameInput, { target: { value: 'new' } });
  fireEvent.change(lastNameInput, { target: { value: 'user' } });
  fireEvent.change(usernameInput, { target: { value: 'newuser' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.change(emailInput, { target: { value: 'new@user.com' } });

  expect(firstNameInput).toHaveValue('new');
  expect(lastNameInput).toHaveValue('user');
  expect(usernameInput).toHaveValue('newuser');
  expect(passwordInput).toHaveValue('password123');
  expect(emailInput).toHaveValue('new@user.com');
  fireEvent.click(button);
  expect(mockRegister).toHaveBeenCalled();
});

