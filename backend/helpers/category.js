//helpers=category.js
function mapCategory(plaidCategory) {
  let regex = /\s+|_+/g;
  plaidCategory = plaidCategory.replace(regex, ' ').toLowerCase();

  // Expanded mapping from Plaid categories to your application's categories
  const categoryMapping = {
    'grocery': 'Groceries',
    'supermarket': 'Groceries',
    'market': 'Groceries',
    'restaurants': 'Eating Out',
    'fast food': 'Eating Out',
    'coffee shop': 'Eating Out',
    'McDonalds': 'Eating Out',
    'Starbucks': 'Eating Out',
    'online shopping': 'Shopping',
    'clothing': 'Shopping',
    'electronics': 'Shopping',
    'delivery': 'Food Delivery',
    'bar': 'Going Out',
    'vacation': 'Going Out',
    'nightlife': 'Going Out',
    'entertainment': 'Going Out',
    'Fun': 'Going Out',
    'transportation': 'Ride Share',
    'travel': 'Ride Share',
    'taxi': 'Ride Share',
    'uber': 'Ride Share',
    'lyft': 'Ride Share',
    'public transit': 'Ride Share',
    'subway': 'Ride Share',
    'rail': 'Ride Share',
    'bus': 'Ride Share',
    // Continue adding other mappings as necessary
  };

  // First, check if the Plaid category is in the mapping and get the corresponding category
  let appCategory = categoryMapping[plaidCategory] || 'Other';

  // Now map the appCategory to your database category IDs
  let dbCategory = {
    'Groceries': 1,
    'Eating Out': 2,
    'Shopping': 3,
    'Food Delivery': 4,
    'Going Out': 5,
    'Ride Share': 6,
    'Other': 7,
  };

  // Return the category id if it exists, otherwise default to 'Other'
  return dbCategory[appCategory];
}

module.exports = { mapCategory };
