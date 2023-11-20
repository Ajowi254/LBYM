/** Function that accepts a current user object and returns user's initials capitalized.
 * To be used in Avatar displayed in navbar.
 */ 

function userInitials(currUserObj) {
  if(currUserObj !== null) {
    let firstName = currUserObj.firstName;
    let lastName = currUserObj.lastName;
    return (firstName.slice(0,1) + lastName.slice(0,1)).toUpperCase();
  }
}

export default userInitials;