const authService = require("../services/auth.service");
const { successResponse } = require("../utils/response");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");

const register = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (!fullname || fullname.trim() === "") {
    throw new ApiError("Fullname wajib diisi", 400);
  }

  if (!username || username.trim() === "") {
    throw new ApiError("Username wajib diisi", 400);
  }

  if (!email || email.trim() === "") {
    throw new ApiError("Email wajib diisi", 400);
  }

  if (!password || password.trim() === "") {
    throw new ApiError("Password wajib diisi", 400);
  }

  const result = await authService.register({
    fullname,
    username,
    email,
    password,
  });

  if (result?.error === "EMAIL_ALREADY_EXISTS") {
    throw new ApiError("Email sudah digunakan", 409);
  }

  if (result?.error === "USERNAME_ALREADY_EXISTS") {
    throw new ApiError("Username sudah digunakan", 409);
  }

  return successResponse(
    res,
    "Registrasi berhasil",
    {
      user_id: result,
    },
    201,
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || email.trim() === "") {
    throw new ApiError("Email wajib diisi", 400);
  }

  if (!password || password.trim() === "") {
    throw new ApiError("Password wajib diisi", 400);
  }

  const result = await authService.login(email, password);

  if (!result) {
    throw new ApiError("Email atau password salah", 401);
  }

  return successResponse(res, "Login berhasil", result);
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token || token.trim() === "") {
    throw new ApiError("Verification token wajib diisi", 400);
  }

  const result = await authService.verifyEmail(token);

  if (result === "INVALID_TOKEN") {
    throw new ApiError("Invalid Verification Token", 400);
  }

  if (result === "ALREADY_VERIFIED") {
    throw new ApiError("Email sudah diverifikasi", 400);
  }

  return successResponse(res, "Email Verified Successfully");
});

module.exports = {
  register,
  login,
  verifyEmail,
};
