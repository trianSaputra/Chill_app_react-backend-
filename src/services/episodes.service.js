const db = require("../config/db");
const buildUpdateFields = require("../helpers/buildUpdateFields");

const getAllEpisodes = async (seriesId) => {
  let query = `
    SELECT
      e.episode_id,
      e.series_id,
      s.title AS series_name,
      e.title,
      e.deskripsi,
      e.nomor_episode,
      e.thumbnail_episode,
      e.durasi,
      e.video_url,
      e.created_at,
      e.updated_at
    FROM episodes e
    JOIN series s
      ON e.series_id = s.series_id
  `;

  const values = [];

  if (seriesId !== undefined) {
    query += ` WHERE e.series_id = ?`;
    values.push(seriesId);
  }

  query += ` ORDER BY e.nomor_episode ASC`;

  const [rows] = await db.query(query, values);

  return rows;
};

const getEpisodeById = async (episodeId) => {
  const [rows] = await db.query(
    `
    SELECT
      episode_id,
      series_id,
      title,
      deskripsi,
      nomor_episode,
      thumbnail_episode,
      durasi,
      video_url,
      created_at,
      updated_at
    FROM episodes
    WHERE episode_id = ?
    `,
    [episodeId],
  );

  return rows[0];
};

const createEpisode = async (episodeData) => {
  const {
    series_id,
    title,
    deskripsi,
    nomor_episode,
    thumbnail_episode,
    durasi,
    video_url,
  } = episodeData;

  const [result] = await db.query(
    `
    INSERT INTO episodes
    (
      series_id,
      title,
      deskripsi,
      nomor_episode,
      thumbnail_episode,
      durasi,
      video_url
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      series_id,
      title,
      deskripsi,
      nomor_episode,
      thumbnail_episode,
      durasi,
      video_url,
    ],
  );

  return result.insertId;
};

const updateEpisode = async (episodeId, episodeData) => {
  const { fields, values } = buildUpdateFields(episodeData);

  const [result] = await db.query(
    `
    UPDATE episodes
    SET
      ${fields.join(", ")}
    WHERE episode_id = ?
    `,
    [...values, episodeId],
  );

  return result.affectedRows;
};

const deleteEpisode = async (episodeId) => {
  const [result] = await db.query(
    `
    DELETE FROM episodes
    WHERE episode_id = ?
    `,
    [episodeId],
  );

  return result.affectedRows;
};

module.exports = {
  getAllEpisodes,
  getEpisodeById,
  createEpisode,
  updateEpisode,
  deleteEpisode,
};
