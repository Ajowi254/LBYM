//api.js
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";
class ExpenseBudApi {
  static token = localStorage.getItem('token');

  static async request(endpoint, data = {}, method = "get") {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" };
    const params = (method === "get") ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error('API request error:', err);
      let message = err.response?.data.error.message || "API Error";
      throw Array.isArray(message) ? message : [message];
    }
  }
  /** User */

  static async register(data) {
    try {
      let res = await this.request(`auth/register`, data, 'post');
      return res.token;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error('Username already exists');
      } else {
        console.error('Unexpected error during registration', error);
        throw error;
      }
    }
  }
  
  static async login(data){
    let res = await this.request(`auth/login`, data, 'post')
    return res.token;
  }

  static async getCurrentUser(id) {
    let res = await this.request(`users/${id}`);
    return res.user;
  }

  static async updateProfile(id, data) {
    let res = await this.request(`users/${id},`, data, 'patch');
    return res.user;
  }

  static async deleteUser(id, data) {
    let res = await this.request(`users/${id}`, data, 'delete');
    return res.deleted;
  }

  /** Plaid */
  static async createLinkToken(data = {}) {
    let res = await this.request('plaid/create_link_token', data, 'post');
    return res;
  }

  static async exchangePublicToken(data) {
    let res = await this.request('plaid/exchange_public_token', data, 'post');
    return res.accessToken;
  }

  static async transactionsSync(data) {
    let res = await this.request('plaid/transactions/sync', data, 'post');
    return res;
  }

  static async getAccountNum(data) {
    let res = await this.request('plaid/auth/get', data, 'post');
    return res;
  }

  /** Account */
  static async getAllAccounts(id) {
    let res = await this.request(`users/${id}/accounts`);
    return res.accounts;
  }

  static async deleteAccount(user_id, account_id, data) {
    let res = await this.request(`users/${user_id}/accounts/${account_id}`, data, 'delete');
    return res; // Now returns { deleted: account.id, aggregatedExpenses }
  }

  /** Expenses */
  static async getAllExpenses(id) {
    let res = await this.request(`users/${id}/expenses`);
    return res.expenses;
  }
  
static async setOrUpdateBudget(userId, categoryId, budgetLimit) {
  let res = await this.request(`users/${userId}/budgets`, { categoryId, budgetLimit }, 'post');
  return res.budget;
}

static async getBudgets(userId) {
  try {
    const res = await this.request(`users/${userId}/budgets`);
    if (res && res.budgets) {
      // Format the response if necessary or directly return the budgets
      return res.budgets.map(budget => ({
        categoryId: budget.category_id,
        budgetLimit: budget.budget_limit
      }));
    }
    return []; // Return an empty array if no budgets are found
  } catch (error) {
    console.error('Error fetching budgets:', error);
    throw error;
  }
}

  static async addExpense(userId, data) {
    let res = await this.request(`users/${userId}/expenses`, data, 'post');
    return res.expense;
  }

  static async editExpense(userId, expenseId, data) {
    let res = await this.request(`users/${userId}/expenses/${expenseId}`, data, 'patch');
    return res.expense;
  }

  static async deleteExpense(userId, expenseId, data) {
    let res = await this.request(`users/${userId}/expenses/${expenseId}`, data, 'delete');
    return res.deleted;
  }

  /** Home Data */
  static async getHomeData(userId) {
    let res = await this.request(`users/${userId}/homepage`);
    return res;
  }
  
/** Image Upload */
/** Update user's profile picture URL */
static async updateProfilePic(userId, imageUrl) {
  const url = `${BASE_URL}/users/${userId}/profile_pic`;
  try {
    const response = await axios.patch(url, { url: imageUrl }, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
}

// Inside ExpenseBudApi class

static async getCategories() {
  try {
    const res = await this.request('categories');
    return res.categories; // Ensure this matches the expected format from your API
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/** Delete user's profile picture */
static async deleteProfilePic(userId) {
  const url = `${BASE_URL}/users/${userId}/profile_pic`;
  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    throw error;
  }
}
// Ensure the getGoals method handles no goals situation by checking for empty response and setting default value.
static async getGoals(userId) {
  try {
    let response = await this.request(`users/${userId}/goals`);
    return response.goals || []; // Return an empty array if no goals found
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
}

static async addGoal(userId, data) {
  let res = await this.request(`users/${userId}/goals`, data, 'post');
  return res.goal;
}

static async updateGoal(userId, goalId, data) {
  let res = await this.request(`users/${userId}/goals/${goalId}`, data, 'patch');
  return res.updatedGoal;
}

static async deleteGoal(userId, goalId) {
  let res = await this.request(`users/${userId}/goals/${goalId}`, {}, 'delete');
  return res.deleted;
}
// Fetch expenses for a specific category of a user
static async getExpensesForCategory(userId, categoryId) {
  try {
    const res = await this.request(`users/${userId}/categories/${categoryId}/expenses`);
    return res.expenses || []; // If no expenses, return an empty array
  } catch (error) {
    console.error('Error fetching expenses for category:', error);
    if (error.response && error.response.status === 404) {
      return []; // Return empty array if no expenses are found
    }
    throw error;
  }
}

static async getAggregatedExpensesByCategory(userId) {
  try {
    const res = await this.request(`users/${userId}/aggregate`);
    return res.aggregatedExpenses; // Update this according to your actual API response structure
  } catch (error) {
    console.error('Error fetching aggregated expenses:', error);
    throw error;
  }
}

// Update the budget for a specific category of a user
static async updateBudget(userId, categoryId, budgetLimit) {
  try {
    // The payload must be structured according to the backend's expectations
    const payload = { budgetLimit };
    const res = await this.request(`users/${userId}/categories/${categoryId}/budget`, payload, 'patch');
    // Assuming the backend returns the updated budget information
    return res.updatedBudget;
  } catch (error) {
    console.error('Error updating budget:', error);
    throw error;
  }
}
static async setOrUpdateBudget(userId, categoryId, budgetLimit) {
  try {
    const res = await this.request(`users/${userId}/budgets`, { categoryId, budgetLimit }, 'post');
    return res.budget;
  } catch (error) {
    console.error('Error setting or updating budget:', error);
    throw error;
  }
}
}
export default ExpenseBudApi;