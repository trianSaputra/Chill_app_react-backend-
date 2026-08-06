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
  const { name, email, avatar } = userData;

  const fields = [];
  const values = [];

  if (name !== undefined) {
    fields.push("name = ?");
    values.push(name);
  }

  if (email !== undefined) {
    fields.push("email = ?");
    values.push(email);
  }

  if (avatar !== undefined) {
    fields.push("avatar = ?");
    values.push(avatar);
  }

  fields.push("updated_at = CURRENT_TIMESTAMP");

  const query = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE user_id = ?
  `;

  values.push(userId);

  const [result] = await db.query(query, values);

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
