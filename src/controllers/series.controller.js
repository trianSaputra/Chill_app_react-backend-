const seriesService = require("../services/series.service");
const genreService = require("../services/genre.service");
const { successResponse } = require("../utils/response");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");

const getAllSeries = asyncHandler(async (req, res) => {
  const series = await seriesService.getAllSeries();
  return successResponse(res, "Berhasil mengambil data semua series", series);
});

const getSeriesById = asyncHandler(async (req, res) => {
  const { id: seriesId } = req.params;
  const seriesData = await seriesService.getSeriesById(seriesId);

  if (!seriesData) {
    throw new ApiError("Series tidak ditemukan", 404);
  }
  return successResponse(res, "Berhasil mengambil data series", seriesData);
});

const createSeries = asyncHandler(async (req, res) => {
  const {
    genre_id,
    title,
    deskripsi,
    thumbnail,
    banner,
    release_date,
    rating,
    status,
  } = req.body;
  if (
    genre_id === undefined ||
    genre_id === null ||
    typeof genre_id !== "number" ||
    genre_id <= 0
  ) {
    throw new ApiError("Genre ID harus berupa angka dan lebih dari 0", 400);
  }
  const genre = await genreService.getGenreById(genre_id);

  if (!genre) {
    throw new ApiError("Genre tidak ditemukan", 404);
  }

  if (!title || title.trim() === "") {
    throw new ApiError("Judul series wajib diisi", 400);
  }

  if (release_date !== undefined && release_date !== null) {
    if (typeof release_date !== "string" || release_date.trim() === "") {
      throw new ApiError("Release date tidak valid", 400);
    }
  }

  if (
    rating !== undefined &&
    rating !== null &&
    (typeof rating !== "number" || rating < 0 || rating > 5)
  ) {
    throw new ApiError("Rating harus berupa angka antara 0 sampai 5", 400);
  }

  if (status !== undefined && !["ONGOING", "COMPLETED"].includes(status)) {
    throw new ApiError("Status series tidak valid", 400);
  }

  const series = await seriesService.createSeries({
    genre_id,
    title,
    deskripsi,
    thumbnail,
    banner,
    release_date,
    rating,
    status,
  });
  return successResponse(
    res,
    "Berhasil menambahkan series",
    { series_id: series },
    201,
  );
});

const updateSeries = asyncHandler(async (req, res) => {
  const { id: seriesId } = req.params;
  const {
    genre_id,
    title,
    deskripsi,
    thumbnail,
    banner,
    release_date,
    rating,
    status,
  } = req.body;

  if (
    genre_id === undefined &&
    title === undefined &&
    deskripsi === undefined &&
    thumbnail === undefined &&
    banner === undefined &&
    release_date === undefined &&
    rating === undefined &&
    status === undefined
  ) {
    return successResponse(res, "Tidak ada perubahan");
  }

  if (
    genre_id !== undefined &&
    (typeof genre_id !== "number" || genre_id <= 0)
  ) {
    throw new ApiError("Genre ID harus berupa angka dan lebih dari 0", 400);
  }
  if (genre_id !== undefined) {
    const genre = await genreService.getGenreById(genre_id);

    if (!genre) {
      throw new ApiError("Genre tidak ditemukan", 404);
    }
  }

  if (title !== undefined && title.trim() === "") {
    throw new ApiError("Judul series tidak boleh kosong", 400);
  }

  if (release_date !== undefined) {
    if (
      release_date !== null &&
      (typeof release_date !== "string" || release_date.trim() === "")
    ) {
      throw new ApiError("Release date tidak valid", 400);
    }
  }

  if (
    rating !== undefined &&
    rating !== null &&
    (typeof rating !== "number" || rating < 0 || rating > 5)
  ) {
    throw new ApiError("Rating harus berupa angka antara 0 sampai 5", 400);
  }

  if (status !== undefined && !["ONGOING", "COMPLETED"].includes(status)) {
    throw new ApiError("Status series tidak valid", 400);
  }

  const affectedRows = await seriesService.updateSeries(seriesId, {
    genre_id,
    title,
    deskripsi,
    thumbnail,
    banner,
    release_date,
    rating,
    status,
  });

  if (affectedRows === 0) {
    throw new ApiError("Series tidak ditemukan", 404);
  }

  return successResponse(res, "Series berhasil diperbarui");
});

const deleteSeries = asyncHandler(async (req, res) => {
  const { id: seriesId } = req.params;
  const affectedRows = await seriesService.deleteSeries(seriesId);

  if (affectedRows === 0) {
    throw new ApiError("Series tidak ditemukan", 404);
  }

  return successResponse(res, "Series berhasil dihapus");
});

module.exports = {
  getAllSeries,
  getSeriesById,
  createSeries,
  updateSeries,
  deleteSeries,
};
