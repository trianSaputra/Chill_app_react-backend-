const genreService = require("../services/genre.service");
const { successResponse } = require("../utils/response");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");

const getAllGenres = asyncHandler(async (req, res) => {
  const genres = await genreService.getAllGenres();
  return successResponse(res, "Berhasil mengambil data semua genre", genres);
});

const getGenreById = asyncHandler(async (req, res) => {
  const { id: genreId } = req.params;
  const genre = await genreService.getGenreById(genreId);

  if (!genre) {
    throw new ApiError("Genre tidak ditemukan", 404);
  }

  return successResponse(res, "Berhasil mengambil data genre", genre);
});

const createGenre = asyncHandler(async (req, res) => {
  const { genre_name } = req.body;
  if (!genre_name || genre_name.trim() === "") {
    throw new ApiError("Nama genre wajib diisi", 400);
  }

  const genreId = await genreService.createGenre(genre_name);
  return successResponse(
    res,
    "Berhasil membuat genre baru",
    { genre_id: genreId },
    201,
  );
});

const updateGenre = asyncHandler(async (req, res) => {
  const { id: genreId } = req.params;
  const { genre_name } = req.body;

  if (genre_name === undefined) {
    return successResponse(res, "Tidak ada perubahan");
  }

  if (genre_name !== undefined && genre_name.trim() === "") {
    throw new ApiError("Nama genre tidak boleh kosong", 400);
  }

  const affectedRows = await genreService.updateGenre(genreId, genre_name);

  if (affectedRows === 0) {
    throw new ApiError("Genre tidak ditemukan", 404);
  }

  return successResponse(res, "Berhasil mengupdate data genre", {
    genre_id: genreId,
    genre_name,
  });
});

const deleteGenre = asyncHandler(async (req, res) => {
  const { id: genreId } = req.params;
  const affectedRows = await genreService.deleteGenre(genreId);

  if (affectedRows === 0) {
    throw new ApiError("Genre tidak ditemukan", 404);
  }

  return successResponse(res, "Berhasil menghapus genre", {
    genre_id: genreId,
  });
});

module.exports = {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
};
