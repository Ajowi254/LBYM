//category.js
function mapCategory(plaidCategory) {
  let regex = /\s+|_+/g;
  plaidCategory = plaidCategory.replace(regex, ' ').toLowerCase();

  // Expanded mapping from Plaid categories to your application's categories
  const categoryMapping = {
    'transportation': 'ride share',
    'travel': 'ride share',
    'taxi': 'ride share',
    'uber': 'ride share',
    'lyft': 'ride share',
    'public transit': 'ride share',
    'subway': 'ride share',
    'rail': 'ride share',
    'bus': 'ride share',
    'restaurants': 'eating out',
    'fast food': 'eating out',
    'coffee shop': 'eating out',
    'bar': 'going out',
    'vacation': 'going out',
    'nightlife': 'going out',
    'entertainment': 'going out',
    'grocery': 'groceries',
    'supermarket': 'groceries',
    'market': 'groceries',
    'delivery': 'food delivery',
    'online shopping': 'shopping',
    'clothing': 'shopping',
    'electronics': 'shopping',
    'McDonalds': 'eating out',
    'Starbucks': 'eating out',
    'Fun': 'going out',

    // Continue adding other mappings as necessary
  };

  // First, check if the Plaid category is in the mapping and get the corresponding category
  let appCategory = categoryMapping[plaidCategory] || 'other';

  // Now map the appCategory to your database category IDs
  let dbCategory = {
    'groceries': 1,
    'eating out': 2,
    'shopping': 3,
    'food delivery': 4,
    'going out': 5,
    'ride share': 6,
    'other': 7,
  };

  // Return the category id if it exists, otherwise default to 'other'
  return dbCategory[appCategory];
}

module.exports = { mapCategory };
