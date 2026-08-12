const db = require("../config/db");

const getAllDaftarSaya = async (userId) => {
  const [rows] = await db.query(
    `
    SELECT
    d.daftar_id,
    d.series_id,
    s.title,
    s.thumbnail,
    s.rating,
    s.status,
    COUNT(e.episode_id) AS total_eps,
    d.created_at
FROM daftar_saya d
JOIN series s
    ON d.series_id = s.series_id
LEFT JOIN episodes e
    ON s.series_id = e.series_id
WHERE d.user_id = ?
GROUP BY d.daftar_id
ORDER BY d.created_at DESC;
    `,
    [userId],
  );

  return rows;
};

const createDaftarSaya = async (userId, seriesId) => {
  const [result] = await db.query(
    `
    INSERT INTO daftar_saya
    (
      user_id,
      series_id
    )
    VALUES (?, ?)
    `,
    [userId, seriesId],
  );

  return result.insertId;
};

const deleteDaftarSaya = async (daftarId, userId) => {
  const [result] = await db.query(
    `
    DELETE FROM daftar_saya
    WHERE daftar_id = ? AND user_id = ?
    `,
    [daftarId, userId],
  );

  return result.affectedRows;
};

module.exports = {
  getAllDaftarSaya,
  createDaftarSaya,
  deleteDaftarSaya,
};
