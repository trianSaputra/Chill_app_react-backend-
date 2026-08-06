const db = require("../config/db");

const getAllGenres = async () => {
  const [rows] = await db.query(
    `
    SELECT
      genre_id,
      genre_name
    FROM genres
    `,
  );

  return rows;
};

const getGenreById = async (genreId) => {
  const [rows] = await db.query(
    `
    SELECT
      genre_id,
      genre_name
    FROM genres
    WHERE genre_id = ?
    `,
    [genreId],
  );

  return rows[0];
};

const createGenre = async (genreName) => {
  const [result] = await db.query(
    `
    INSERT INTO genres (genre_name)
    VALUES (?)
    `,
    [genreName],
  );

  return result.insertId;
};

const updateGenre = async (genreId, genreName) => {
  const [result] = await db.query(
    `
    UPDATE genres
    SET
      genre_name = ?
    WHERE genre_id = ?
    `,
    [genreName, genreId],
  );

  return result.affectedRows;
};

const deleteGenre = async (genreId) => {
  const [result] = await db.query(
    `
    DELETE FROM genres
    WHERE genre_id = ?
    `,
    [genreId],
  );

  return result.affectedRows;
};

module.exports = {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
};
