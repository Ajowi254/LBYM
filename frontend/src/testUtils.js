//testutils.js
import UserContext from "./context/UserContext";

const demoUser = {
  id: 1,
  username: "testuser",
  firstName: "testfirst",
  lastName: "testlast",
  email: "test@test.com"
};

const UserProvider =
    ({ children, currentUser = demoUser}) => (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
);

export { UserProvider };