//category.js
const { BadRequestError } = require("../expressErrors");

/**
 * Maps Plaid personal_finance_category string to database category
 * Returns category_id.
 */
function mapCategory(plaidCategory) {
  // This regular expression will convert strings like "Food_and_Drink" to "Food and Drink"
  let regex = /\s+|_+/g;
  plaidCategory = plaidCategory.replace(regex, ' ').toLowerCase();

  // This object should map Plaid categories to your database category IDs
  let dbCategory = {
    'groceries': 1,         // Assuming 1 is the ID for Groceries in your database
    'eating out': 2,        // Assuming 2 is the ID for Eating Out
    'shopping': 3,          // And so on for the rest of the categories...
    'food delivery': 4,
    'going out': 5,
    'ride share': 6
  };

  // Check if the Plaid category exists in dbCategory mapping
  if (!dbCategory[plaidCategory]) {
    throw new BadRequestError(`${plaidCategory} does not exist`);
  }

  // Return the database category ID
  return dbCategory[plaidCategory];
}

module.exports = { mapCategory };
