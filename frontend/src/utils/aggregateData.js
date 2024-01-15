//aggregatedata.js
function groupAndAggregateData(data) {
  const aggregatedData = {};

  for (const item of data) {
    if (aggregatedData[item.category]) {
      aggregatedData[item.category] += +item.amount;
    } else {
      aggregatedData[item.category] = +item.amount;
    }
  }

  const aggregatedArray = Object.keys(aggregatedData).map(category => ({
    category,
    amount: aggregatedData[category]
  }));

  return aggregatedArray;
}

function goalByCategory(arr) {
  return arr.reduce((acc, item) => {
    acc[item.category] = item.amount;
    return acc;
  }, {});
} 

export { groupAndAggregateData, goalByCategory } ;