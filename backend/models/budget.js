// models/Budget.js
const db = require("../db");
const Expense = require("./expense"); // Import Expense model
const Notification = require("./notification");
const Goal = require("./goal");
class Budget {
  static async setOrUpdateBudget(userId, categoryId, budgetLimit) {
    // Delete any existing notifications related to the budget category
    await Notification.removeByUserIdAndCategoryId(userId, categoryId);
  
    // Update or insert the budget as before
    const result = await db.query(
      `INSERT INTO category_budgets (user_id, category_id, budget_limit)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, category_id)
       DO UPDATE SET budget_limit = EXCLUDED.budget_limit
       RETURNING id, user_id, category_id, budget_limit`,
      [userId, categoryId, budgetLimit]
    );
    return result.rows[0];
  }

  static async getBudgets(userId) {
    const result = await db.query(
      `SELECT category_id, budget_limit FROM category_budgets WHERE user_id = $1`,
      [userId]
    );
    return result.rows;
  }
  static async calculateRemainingBudget(userId) {
    console.log('calculateRemainingBudget called with userId:', userId);
    // Get the budget and expenses for each category
    const budgets = await Goal.getBudgetByCategory(userId); // Use Goal model to get budgets
    const expenses = await Expense.getSumByCategory(userId);
    
    // Initialize an empty array to hold the promises for creating notifications
    let notificationPromises = [];
    let remainingBudgets = [];
  
    // Calculate the remaining budget for each category
    for (let budget of budgets) {
      let expense = expenses.find(e => e.category_id === budget.category_id);
      let totalExpense = expense ? parseFloat(expense.total) : 0;
      let remainingBudget = parseFloat(budget.total_budget) - totalExpense; // Use total_budget from Goal model
  
// Store each remaining budget in the array
remainingBudgets.push({
  categoryId: budget.category_id,
  remainingBudget: remainingBudget
});

      // Create the notification message
      let message;
      if (remainingBudget > 0) {
        message = `Your ${budget.name} budget is $${budget.total_budget} of which you have spent $${totalExpense} this month, leaving you with $${remainingBudget} for the month.`;
      } else if (remainingBudget === 0) {
        message = `Your ${budget.name} budget is $${budget.total_budget} and you have spent the entire budget this month.`;
      } else {
        message = `Your ${budget.name} budget is $${budget.total_budget} and you have exceeded the budget by $${-remainingBudget} this month.`;
      }
  
      // Create a notification in the database
      let notificationPromise = Notification.create({ userId, message, type: 'budget' });
      notificationPromises.push(notificationPromise);
    }
  
    // Wait for all notifications to be created
    let newNotifications = await Promise.all(notificationPromises);
    console.log('New notifications created:', newNotifications);
    // Emit a Socket.IO event for each new notification
    const io = require('../server').io; // Import the io instance from server.js
    newNotifications.forEach(notification => {
      console.log('Emitting notification event for notification:', notification);
      io.emit('notification', { userId, notification });
    });

    
    // Return the budgets (or remaining budgets, if you prefer) and new notifications
    return { budgets, remainingBudgets, newNotifications };
  }
}
module.exports = Budget;

