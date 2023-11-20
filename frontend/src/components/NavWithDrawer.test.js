import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { UserProvider } from "../testUtils";
import NavWithDrawer from "./NavWithDrawer";

it("renders without crashing", () => {
  render(
    <MemoryRouter>
      <UserProvider>
        <NavWithDrawer/>
      </UserProvider>
    </MemoryRouter>
  );
});

it("matches snapshot", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <UserProvider>
        <NavWithDrawer/>
      </UserProvider>
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("matches snapshot when logged out", () => {
  const { asFragment} = render(
    <MemoryRouter>
      <UserProvider currentUser={null}>
        <NavWithDrawer/>
      </UserProvider>
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});