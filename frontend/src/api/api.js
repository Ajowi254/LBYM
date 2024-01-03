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

  /** Budget */

  static async getAllBudgets(id) {
    let res = await this.request(`users/${id}/budgets`);
    return res.budgets;
  }

  static async updateBudget(userId, budgetId, data) {
    let res = await this.request(`users/${userId}/budgets/${budgetId}`, data, 'patch');
    return res.budget;
  }

  static async addBudget(userId, data) {
    let res = await this.request(`users/${userId}/budgets`, data, 'post');
    return res.budget;
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
   /** Image Upload */
   static async uploadImage(userId, file) {
    const url = `${BASE_URL}/users/${userId}/profile_pic`;
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.put(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
  }

  /** Delete Profile Picture */
  static async deleteProfilePic(userId) {
    const url = `${BASE_URL}/users/${userId}/profile_pic`;

    const response = await axios.delete(url, {
      headers: { 'Content-Type': 'application/json' }
    });

    return response.data;
  }
}

export default ExpenseBudApi;