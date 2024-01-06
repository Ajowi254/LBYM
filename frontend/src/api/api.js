//api.js
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";
class ExpenseBudApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error('Unexpected error during login', err);
      let message = err.response.data.error.message;
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

  /** Goals */
  static async getGoals(userId) {
    let res = await this.request(`users/${userId}/goals`);
    return res.goals;
  }

  static async addGoal(userId, data) {
    let res = await this.request(`users/${userId}/goals`, data, 'post');
    return res.goal;
  }

  static async updateGoal(userId, goalId, data) {
    let res = await this.request(`users/${userId}/goals/${goalId}`, data, 'patch');
    return res.goal;
  }

  static async deleteGoal(userId, goalId) {
    let res = await this.request(`users/${userId}/goals/${goalId}`, {}, 'delete');
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
    return res;
  }

  /** Expenses */
  static async getAllExpenses(id) {
    let res = await this.request(`users/${id}/expenses`);
    return res.expenses;
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

static async getCategories() {
  try {
    const response = await axios.get(`${BASE_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response.data;
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
}
export default ExpenseBudApi;