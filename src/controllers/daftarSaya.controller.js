const daftarSayaService = require("../services/daftarSaya.service");
const { successResponse } = require("../utils/response");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");

const getAllDaftarSaya = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;

  const data = await daftarSayaService.getAllDaftarSaya(userId);

  return successResponse(res, "Berhasil mengambil data daftar saya", data);
});

const createDaftarSaya = asyncHandler(async (req, res) => {
  const user_id = req.user.user_id;
  const { series_id } = req.body;

  if (
    series_id === undefined ||
    series_id === null ||
    typeof series_id !== "number" ||
    series_id <= 0
  ) {
    throw new ApiError("Series ID harus berupa angka dan lebih dari 0", 400);
  }

  const daftarId = await daftarSayaService.createDaftarSaya(user_id, series_id);

  return successResponse(
    res,
    "Series berhasil ditambahkan ke Daftar Saya",
    { daftar_id: daftarId },
    201,
  );
});

const deleteDaftarSaya = asyncHandler(async (req, res) => {
  const { id: daftarId } = req.params;
  const userId = req.user.user_id;

  const affectedRows = await daftarSayaService.deleteDaftarSaya(
    daftarId,
    userId,
  );

  if (affectedRows === 0) {
    throw new ApiError("Data Daftar Saya tidak ditemukan", 404);
  }

  return successResponse(res, "Series berhasil dihapus dari Daftar Saya");
});

module.exports = {
  getAllDaftarSaya,
  createDaftarSaya,
  deleteDaftarSaya,
};
