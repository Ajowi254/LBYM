//routestest.js
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { UserProvider } from "../testUtils";
import Routes from "./Routes";

it("renders without crashing", () => {
  render(
    <MemoryRouter>
      <UserProvider>
        <Routes />
      </UserProvider>
    </MemoryRouter>
  );
});

it("matches snapshot", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <UserProvider>
        <Routes />
      </UserProvider>
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

