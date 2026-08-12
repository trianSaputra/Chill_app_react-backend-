const buildUpdateFields = require("../helpers/buildUpdateFields");
const db = require("../config/db");

const getAllUsers = async () => {
  const [rows] = await db.query(
    "SELECT user_id, name, email , avatar , created_at , updated_at FROM users",
  );
  return rows;
};

const getUserById = async (userId) => {
  const [rows] = await db.query(
    "SELECT user_id, name, email , avatar , created_at , updated_at FROM users WHERE user_id = ?",
    [userId],
  );
  return rows[0];
};

const createUser = async (userData) => {
  const { name, email, password, avatar } = userData;
  const [result] = await db.query(
    "INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)",
    [name, email, password, avatar],
  );
  console.log("User created with ID:", result.insertId);
  return result.insertId;
};

const updateUser = async (userId, userData) => {
  const { fields, values } = buildUpdateFields(userData);
  const [result] = await db.query(
    `UPDATE users SET ${fields} WHERE user_id = ?`,
    [...values, userId],
  );
  return result.affectedRows;
};

const deleteUser = async (userId) => {
  const [result] = await db.query("DELETE FROM users WHERE user_id = ?", [
    userId,
  ]);
  return result.affectedRows;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
