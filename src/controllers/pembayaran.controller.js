const pembayaranService = require("../services/pembayaran.service");
const { successResponse } = require("../utils/response");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");

const getAllPembayaran = asyncHandler(async (req, res) => {
  const userId = Number(req.query.user_id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new ApiError("User ID harus berupa angka dan lebih dari 0", 400);
  }

  const pembayaran = await pembayaranService.getAllPembayaran(userId);

  return successResponse(res, "Berhasil mengambil data pembayaran", pembayaran);
});

const getPembayaranById = asyncHandler(async (req, res) => {
  const { id: pembayaranId } = req.params;
  const userId = Number(req.query.user_id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new ApiError("User ID harus berupa angka dan lebih dari 0", 400);
  }

  const pembayaran = await pembayaranService.getPembayaranById(
    pembayaranId,
    userId,
  );

  if (!pembayaran) {
    throw new ApiError("Pembayaran tidak ditemukan", 404);
  }

  return successResponse(res, "Berhasil mengambil data pembayaran", pembayaran);
});

const createPembayaran = asyncHandler(async (req, res) => {
  const { order_id, metode_pembayaran } = req.body;

  if (
    order_id === undefined ||
    order_id === null ||
    typeof order_id !== "number" ||
    order_id <= 0
  ) {
    throw new ApiError("Order ID harus berupa angka dan lebih dari 0", 400);
  }

  if (!["TRANSFER", "E-WALLET", "CREDIT_CARD"].includes(metode_pembayaran)) {
    throw new ApiError("Metode pembayaran tidak valid", 400);
  }

  const result = await pembayaranService.createPembayaran(
    order_id,
    metode_pembayaran,
  );

  if (result === null) {
    throw new ApiError("Order tidak ditemukan", 404);
  }

  if (result.error === "ORDER_NOT_PENDING") {
    throw new ApiError(
      "Order tidak dapat dibayar karena status bukan PENDING",
      400,
    );
  }

  if (result.error === "PAYMENT_ALREADY_EXISTS") {
    throw new ApiError("Order sudah memiliki pembayaran", 400);
  }

  return successResponse(
    res,
    "Pembayaran berhasil dibuat",
    {
      pembayaran_id: result,
    },
    201,
  );
});

module.exports = {
  getAllPembayaran,
  getPembayaranById,
  createPembayaran,
};
