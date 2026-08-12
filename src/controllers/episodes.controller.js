const episodesService = require("../services/episodes.service");
const seriesService = require("../services/series.service");
const { successResponse } = require("../utils/response");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");

const getAllEpisodes = asyncHandler(async (req, res) => {
  const { series_id } = req.query;

  if (series_id !== undefined && (isNaN(series_id) || Number(series_id) <= 0)) {
    throw new ApiError("Series ID tidak valid", 400);
  }
  const episodes = await episodesService.getAllEpisodes(
    series_id ? Number(series_id) : undefined,
  );

  return successResponse(
    res,
    "Berhasil mengambil data semua episode",
    episodes,
  );
});

const getEpisodeById = asyncHandler(async (req, res) => {
  const { id: episodeId } = req.params;

  const episodeData = await episodesService.getEpisodeById(episodeId);

  if (!episodeData) {
    throw new ApiError("Episode tidak ditemukan", 404);
  }

  return successResponse(res, "Berhasil mengambil data episode", episodeData);
});

const createEpisode = asyncHandler(async (req, res) => {
  const {
    series_id,
    title,
    deskripsi,
    nomor_episode,
    thumbnail_episode,
    durasi,
    video_url,
  } = req.body;

  if (
    series_id === undefined ||
    series_id === null ||
    typeof series_id !== "number" ||
    series_id <= 0
  ) {
    throw new ApiError("Series ID harus berupa angka dan lebih dari 0", 400);
  }

  const series = await seriesService.getSeriesById(series_id);

  if (!series) {
    throw new ApiError("Series tidak ditemukan", 404);
  }

  if (!title || title.trim() === "") {
    throw new ApiError("Judul episode wajib diisi", 400);
  }

  if (
    nomor_episode === undefined ||
    nomor_episode === null ||
    typeof nomor_episode !== "number" ||
    nomor_episode <= 0
  ) {
    throw new ApiError(
      "Nomor episode harus berupa angka dan lebih dari 0",
      400,
    );
  }

  if (
    durasi !== undefined &&
    durasi !== null &&
    (typeof durasi !== "number" || durasi <= 0)
  ) {
    throw new ApiError("Durasi harus berupa angka dan lebih dari 0", 400);
  }

  const episodeId = await episodesService.createEpisode({
    series_id,
    title,
    deskripsi,
    nomor_episode,
    thumbnail_episode,
    durasi,
    video_url,
  });

  return successResponse(
    res,
    "Berhasil menambahkan episode",
    {
      episode_id: episodeId,
    },
    201,
  );
});

const updateEpisode = asyncHandler(async (req, res) => {
  const { id: episodeId } = req.params;

  const {
    series_id,
    title,
    deskripsi,
    nomor_episode,
    thumbnail_episode,
    durasi,
    video_url,
  } = req.body;

  if (
    series_id === undefined &&
    title === undefined &&
    deskripsi === undefined &&
    nomor_episode === undefined &&
    thumbnail_episode === undefined &&
    durasi === undefined &&
    video_url === undefined
  ) {
    return successResponse(res, "Tidak ada perubahan");
  }

  if (series_id !== undefined) {
    if (typeof series_id !== "number" || series_id <= 0) {
      throw new ApiError("Series ID harus berupa angka dan lebih dari 0", 400);
    }

    const series = await seriesService.getSeriesById(series_id);

    if (!series) {
      throw new ApiError("Series tidak ditemukan", 404);
    }
  }

  if (title !== undefined && title.trim() === "") {
    throw new ApiError("Judul episode tidak boleh kosong", 400);
  }

  if (
    nomor_episode !== undefined &&
    (typeof nomor_episode !== "number" || nomor_episode <= 0)
  ) {
    throw new ApiError(
      "Nomor episode harus berupa angka dan lebih dari 0",
      400,
    );
  }

  if (
    durasi !== undefined &&
    durasi !== null &&
    (typeof durasi !== "number" || durasi <= 0)
  ) {
    throw new ApiError("Durasi harus berupa angka dan lebih dari 0", 400);
  }

  const affectedRows = await episodesService.updateEpisode(episodeId, {
    series_id,
    title,
    deskripsi,
    nomor_episode,
    thumbnail_episode,
    durasi,
    video_url,
  });

  if (affectedRows === 0) {
    throw new ApiError("Episode tidak ditemukan", 404);
  }

  return successResponse(res, "Episode berhasil diperbarui");
});

const deleteEpisode = asyncHandler(async (req, res) => {
  const { id: episodeId } = req.params;

  const affectedRows = await episodesService.deleteEpisode(episodeId);

  if (affectedRows === 0) {
    throw new ApiError("Episode tidak ditemukan", 404);
  }

  return successResponse(res, "Episode berhasil dihapus");
});

module.exports = {
  getAllEpisodes,
  getEpisodeById,
  createEpisode,
  updateEpisode,
  deleteEpisode,
};
