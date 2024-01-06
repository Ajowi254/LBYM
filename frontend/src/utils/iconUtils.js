//iconUtils.js 
// Assuming you store your icons in the public folder, and your API returns the category names exactly as they are here.
const iconPaths = {
  "Groceries": "/screenshots/Groceries.svg",
  "Eating Out": "/screenshots/EatingOut(1).svg",
  "Going Out": "/screenshots/GoingOut.svg",
  "Shopping": "/screenshots/Shopping.svg",
  "Food Delivery": "/screenshots/Delivery.svg",
  "Ride Share": "/screenshots/RideShare.svg",
};

export function getIconPath(categoryName) {
  return iconPaths[categoryName] || '/screenshots/defaultIcon.svg';
}
