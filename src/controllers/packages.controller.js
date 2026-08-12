const packageService = require("../services/packages.service");
const { successResponse } = require("../utils/response");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");

const getAllPackages = asyncHandler(async (req, res) => {
  const packages = await packageService.getAllPackages();
  return successResponse(res, "Berhasil mengambil data semua paket", packages);
});

const getPackageById = asyncHandler(async (req, res) => {
  const { id: packageId } = req.params;
  const packageData = await packageService.getPackageById(packageId);

  if (!packageData) {
    throw new ApiError("Paket tidak ditemukan", 404);
  }
  return successResponse(res, "Berhasil mengambil data paket", packageData);
});

const createPackage = asyncHandler(async (req, res) => {
  const { nama_paket, harga, durasi_paket, kualitas_video, jumlah_akun } =
    req.body;

  if (!nama_paket || nama_paket.trim() === "") {
    throw new ApiError("Nama paket wajib diisi", 400);
  }
  if (
    harga === undefined ||
    harga === null ||
    typeof harga !== "number" ||
    harga < 0
  ) {
    throw new ApiError("Harga harus berupa angka dan tidak boleh negatif", 400);
  }
  if (
    durasi_paket === undefined ||
    durasi_paket === null ||
    typeof durasi_paket !== "number" ||
    durasi_paket <= 0
  ) {
    throw new ApiError(
      "Durasi paket harus berupa angka dan tidak boleh negatif",
      400,
    );
  }
  if (!kualitas_video || kualitas_video.trim() === "") {
    throw new ApiError("Kualitas video tidak boleh kosong", 400);
  }
  if (!["480p", "720p", "1080p", "4K"].includes(kualitas_video)) {
    throw new ApiError("Kualitas video tidak valid", 400);
  }
  if (
    jumlah_akun === undefined ||
    jumlah_akun === null ||
    typeof jumlah_akun !== "number" ||
    jumlah_akun <= 0
  ) {
    throw new ApiError("Jumlah akun harus berupa angka dan lebih dari 0", 400);
  }

  const packageId = await packageService.createPackage({
    nama_paket,
    harga,
    durasi_paket,
    kualitas_video,
    jumlah_akun,
  });
  return successResponse(
    res,
    "Berhasil membuat paket",
    { paket_id: packageId },
    201,
  );
});

const updatePackage = asyncHandler(async (req, res) => {
  const { id: packageId } = req.params;
  const { nama_paket, harga, durasi_paket, kualitas_video, jumlah_akun } =
    req.body;

  if (
    nama_paket === undefined &&
    harga === undefined &&
    durasi_paket === undefined &&
    kualitas_video === undefined &&
    jumlah_akun === undefined
  ) {
    return successResponse(res, "Tidak ada perubahan");
  }

  if (nama_paket !== undefined && nama_paket.trim() === "") {
    throw new ApiError("Nama paket tidak boleh kosong", 400);
  }
  if (harga !== undefined && (typeof harga !== "number" || harga < 0)) {
    throw new ApiError(
      "Harga paket harus berupa angka dan tidak boleh negatif",
      400,
    );
  }
  if (
    durasi_paket !== undefined &&
    (typeof durasi_paket !== "number" || durasi_paket <= 0)
  ) {
    throw new ApiError("Durasi paket harus berupa angka dan lebih dari 0", 400);
  }
  if (kualitas_video !== undefined && kualitas_video.trim() === "") {
    throw new ApiError("Kualitas video tidak boleh kosong", 400);
  }
  if (
    kualitas_video !== undefined &&
    !["480p", "720p", "1080p", "4K"].includes(kualitas_video)
  ) {
    throw new ApiError("Kualitas video tidak valid", 400);
  }
  if (
    jumlah_akun !== undefined &&
    (typeof jumlah_akun !== "number" || jumlah_akun <= 0)
  ) {
    throw new ApiError(
      "Jumlah akun harus berupa angka dan tidak boleh negatif",
      400,
    );
  }

  const affectedRows = await packageService.updatePackage(packageId, {
    nama_paket,
    harga,
    durasi_paket,
    kualitas_video,
    jumlah_akun,
  });

  if (affectedRows === 0) {
    throw new ApiError("Paket tidak ditemukan", 404);
  }

  return successResponse(res, "Paket berhasil diperbarui");
});

const deletePackage = asyncHandler(async (req, res) => {
  const { id: packageId } = req.params;
  const affectedRows = await packageService.deletePackage(packageId);

  if (affectedRows === 0) {
    throw new ApiError("Paket tidak ditemukan", 404);
  }

  return successResponse(res, "Paket berhasil dihapus");
});

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
};
