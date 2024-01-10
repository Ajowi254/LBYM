//expense.js
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressErrors");

class Expense {
    static async get(user_id, expense_id) {
        const result = await db.query(
            `SELECT e.id, amount, date, vendor, description, e.category_id, c.category, user_id, transaction_id
            FROM expenses e
            JOIN categories c ON e.category_id = c.id
            WHERE e.id = $1 AND user_id = $2`,
            [expense_id, user_id]
        );

        const expense = result.rows[0];
        if (!expense) throw new NotFoundError(`No expense id: ${expense_id}`);
        return expense;
    }

    static async findAll(user_id) {
        const result = await db.query(
            `SELECT e.id, amount, date, vendor, description, e.category_id, c.category, transaction_id
            FROM expenses e
            JOIN categories c ON e.category_id = c.id
            WHERE user_id = $1
            ORDER BY date DESC`,
            [user_id]
        );

        return result.rows;
    }

    static async create(user_id, { amount, date, vendor, description, category_id, transaction_id }) {
        if (transaction_id) {
            const duplicateCheck = await db.query(
                `SELECT transaction_id FROM expenses WHERE transaction_id = $1`,
                [transaction_id]
            );

            if (duplicateCheck.rows[0]) {
                throw new BadRequestError(`Duplicate expense: ${transaction_id}`);
            }
        }

        const result = await db.query(
            `INSERT INTO expenses
            (amount, date, vendor, description, category_id, user_id, transaction_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, amount, date, vendor, description, category_id, user_id, transaction_id`,
            [amount, date, vendor, description, category_id, user_id, transaction_id]
        );

        return result.rows[0];
    }

    static async update(user_id, expense_id, data) {
        const { setCols, values } = partialUpdateSql(data, {});
        const expIdPosition = "$" + (values.length + 1);
        const userIdPosition = "$" + (values.length + 2);

        const sqlQuery = `
            UPDATE expenses 
            SET ${setCols} 
            WHERE id = ${expIdPosition} AND user_id = ${userIdPosition}
            RETURNING id, amount, date, vendor, description, category_id`;

        const result = await db.query(sqlQuery, [...values, expense_id, user_id]);
        const expense = result.rows[0];

        if (!expense) throw new NotFoundError(`No expense id: ${expense_id}`);

        return expense;
    }

    static async remove(user_id, expense_id) {
        const result = await db.query(
            `DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id`,
            [expense_id, user_id]
        );

        return result.rows[0];
    }
}

module.exports = Expense;
