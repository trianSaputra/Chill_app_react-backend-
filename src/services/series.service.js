const db = require("../config/db");
const buildUpdateFields = require("../helpers/buildUpdateFields");

const getAllSeries = async () => {
  const [rows] = await db.query(`
    SELECT
      s.series_id,
      s.genre_id,
      g.genre_name,
      s.title,
      s.deskripsi,
      s.thumbnail,
      s.banner,
      s.release_date,
      COUNT(e.episode_id) AS total_eps,
      s.rating,
      s.status,
      s.created_at,
      s.updated_at
    FROM series s
    JOIN genres g
      ON s.genre_id = g.genre_id
    LEFT JOIN episodes e
      ON s.series_id = e.series_id
    GROUP BY s.series_id
    `);
  return rows;
};

const getSeriesById = async (seriesId) => {
  const [rows] = await db.query(
    `
    SELECT
      s.series_id,
      s.genre_id,
      g.genre_name,
      s.title,
      s.deskripsi,
      s.thumbnail,
      s.banner,
      s.release_date,
      COUNT(e.episode_id) AS total_eps,
      s.rating,
      s.status,
      s.created_at,
      s.updated_at
    FROM series s
    JOIN genres g
      ON s.genre_id = g.genre_id
    LEFT JOIN episodes e
      ON s.series_id = e.series_id
    WHERE s.series_id = ?
    GROUP BY s.series_id
    `,
    [seriesId],
  );
  return rows[0];
};

const createSeries = async (seriesData) => {
  const {
    genre_id,
    title,
    deskripsi,
    thumbnail,
    banner,
    release_date,
    rating,
    status,
  } = seriesData;
  const [result] = await db.query(
    `
    INSERT INTO series
    (
      genre_id,
      title,
      deskripsi,
      thumbnail,
      banner,
      release_date,
      rating,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      genre_id,
      title,
      deskripsi,
      thumbnail,
      banner,
      release_date,
      rating,
      status ?? "ONGOING",
    ],
  );
  return result.insertId;
};

const updateSeries = async (seriesId, seriesData) => {
  const { fields, values } = buildUpdateFields(seriesData);

  const [result] = await db.query(
    `
      UPDATE series
      SET
        ${fields.join(", ")}
      WHERE series_id = ?
      `,
    [...values, seriesId],
  );
  return result.affectedRows;
};

const deleteSeries = async (seriesId) => {
  const [result] = await db.query(
    `
    DELETE FROM series
    WHERE series_id = ?
    `,
    [seriesId],
  );
  return result.affectedRows;
};

module.exports = {
  getAllSeries,
  getSeriesById,
  createSeries,
  updateSeries,
  deleteSeries,
};
