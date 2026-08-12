const orderService = require("../services/order.service");
const { successResponse } = require("../utils/response");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");

const getAllOrders = asyncHandler(async (req, res) => {
  const userId = Number(req.query.user_id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new ApiError("User ID harus berupa angka dan lebih dari 0", 400);
  }

  const orders = await orderService.getAllOrders(userId);

  return successResponse(res, "Berhasil mengambil data order", orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id: orderId } = req.params;
  const userId = Number(req.query.user_id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new ApiError("User ID harus berupa angka dan lebih dari 0", 400);
  }

  const order = await orderService.getOrderById(orderId, userId);

  if (!order) {
    throw new ApiError("Order tidak ditemukan", 404);
  }

  return successResponse(res, "Berhasil mengambil data order", order);
});

const createOrder = asyncHandler(async (req, res) => {
  const { user_id, paket_id } = req.body;

  if (
    user_id === undefined ||
    user_id === null ||
    typeof user_id !== "number" ||
    user_id <= 0
  ) {
    throw new ApiError("User ID harus berupa angka dan lebih dari 0", 400);
  }

  if (
    paket_id === undefined ||
    paket_id === null ||
    typeof paket_id !== "number" ||
    paket_id <= 0
  ) {
    throw new ApiError("Paket ID harus berupa angka dan lebih dari 0", 400);
  }

  const orderId = await orderService.createOrder(user_id, paket_id);

  if (!orderId) {
    throw new ApiError("Paket tidak ditemukan", 404);
  }

  return successResponse(
    res,
    "Order berhasil dibuat",
    { order_id: orderId },
    201,
  );
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { id: orderId } = req.params;
  const userId = Number(req.query.user_id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new ApiError("User ID harus berupa angka dan lebih dari 0", 400);
  }

  const affectedRows = await orderService.cancelOrder(orderId, userId);

  if (affectedRows === 0) {
    throw new ApiError(
      "Order tidak ditemukan atau tidak dapat dibatalkan",
      404,
    );
  }

  return successResponse(res, "Order berhasil dibatalkan");
});

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  cancelOrder,
};
