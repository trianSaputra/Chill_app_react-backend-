const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const emailService = require("./email.service");

const register = async (userData) => {
  const { fullname, username, email, password } = userData;

  const [existingUsers] = await db.query(
    `
    SELECT user_id, email, username
    FROM users
    WHERE email = ? OR username = ?
    `,
    [email, username],
  );

  if (existingUsers.length > 0) {
    if (existingUsers[0].email === email) {
      return {
        error: "EMAIL_ALREADY_EXISTS",
      };
    }

    if (existingUsers[0].username === username) {
      return {
        error: "USERNAME_ALREADY_EXISTS",
      };
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationToken = uuidv4();

  const [result] = await db.query(
    `
    INSERT INTO users
    (
      fullname,
      username,
      email,
      password,
      verification_token,
      is_verified
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [fullname, username, email, hashedPassword, verificationToken, false],
  );

  await emailService.sendVerificationEmail(email, verificationToken);

  return result.insertId;
};

const login = async (email, password) => {
  const [rows] = await db.query(
    `
    SELECT
      user_id,
      fullname,
      username,
      email,
      password
    FROM users
    WHERE email = ?
    `,
    [email],
  );

  if (rows.length === 0) {
    return null;
  }

  const user = rows[0];

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  return {
    token,
    user: {
      user_id: user.user_id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
    },
  };
};

const verifyEmail = async (token) => {
  const [rows] = await db.query(
    `
    SELECT
      user_id,
      is_verified
    FROM users
    WHERE verification_token = ?
    `,
    [token],
  );

  if (rows.length === 0) {
    return "INVALID_TOKEN";
  }

  const user = rows[0];

  if (user.is_verified) {
    return "ALREADY_VERIFIED";
  }

  await db.query(
    `
    UPDATE users
    SET
      is_verified = TRUE,
      verification_token = NULL
    WHERE user_id = ?
    `,
    [user.user_id],
  );

  return "SUCCESS";
};

module.exports = {
  register,
  login,
  verifyEmail,
};
