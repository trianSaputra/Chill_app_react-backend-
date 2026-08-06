const userService = require("../services/user.service");
const { successResponse } = require("../utils/response");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();

  return successResponse(res, "Berhasil mengambil data semua user", users);
});

const getUserById = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const user = await userService.getUserById(userId);

  if (!user) {
    throw new ApiError("User tidak ditemukan", 404);
  }

  return successResponse(res, "Berhasil mengambil data user", user);
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, avatar } = req.body;

  if (!name || !email || !password) {
    throw new ApiError("Name, email, dan password wajib diisi", 400);
  }

  const userId = await userService.createUser({
    name,
    email,
    password,
    avatar: avatar || null,
  });

  return successResponse(
    res,
    "User berhasil dibuat",
    {
      user_id: userId,
    },
    201,
  );
});

const updateUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const { name, email, avatar } = req.body;
  if (name === undefined && email === undefined && avatar === undefined) {
    return successResponse(res, "Tidak ada perubahan");
  }

  if (name !== undefined && name.trim() === "") {
    throw new ApiError("Name tidak boleh kosong", 400);
  }
  if (email !== undefined && email.trim() === "") {
    throw new ApiError("Email tidak boleh kosong", 400);
  }
  const affectedRows = await userService.updateUser(userId, {
    name,
    email,
    avatar,
  });

  if (affectedRows === 0) {
    throw new ApiError("User tidak ditemukan", 404);
  }

  return successResponse(res, "User berhasil diperbarui");
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;

  const affectedRows = await userService.deleteUser(userId);

  if (affectedRows === 0) {
    throw new ApiError("User tidak ditemukan", 404);
  }

  return successResponse(res, "User berhasil dihapus");
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
