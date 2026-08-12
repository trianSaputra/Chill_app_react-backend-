const db = require("../config/db");
const buildUpdateFields = require("../helpers/buildUpdateFields");

const getAllPackages = async () => {
  const [rows] = await db.query(`
    SELECT
      paket_id,
      nama_paket,
      harga,
      durasi_paket,
      kualitas_video,
      jumlah_akun,
      created_at,
      updated_at
    FROM packages
  `);

  return rows;
};

const getPackageById = async (packageId) => {
  const [rows] = await db.query(
    `
    SELECT
      paket_id,
      nama_paket,
      harga,
      durasi_paket,
      kualitas_video,
      jumlah_akun,
      created_at,
      updated_at
    FROM packages
    WHERE paket_id = ?
    `,
    [packageId],
  );

  return rows[0];
};

const createPackage = async (packageData) => {
  const { nama_paket, harga, durasi_paket, kualitas_video, jumlah_akun } =
    packageData;

  const [result] = await db.query(
    `
    INSERT INTO packages
    (
      nama_paket,
      harga,
      durasi_paket,
      kualitas_video,
      jumlah_akun
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [nama_paket, harga, durasi_paket, kualitas_video, jumlah_akun],
  );

  return result.insertId;
};

const updatePackage = async (packageId, packageData) => {
  const { fields, values } = buildUpdateFields(packageData);

  const [result] = await db.query(
    `
    UPDATE packages
    SET
      ${fields.join(", ")}
    WHERE paket_id = ?
    `,
    [...values, packageId],
  );

  return result.affectedRows;
};

const deletePackage = async (packageId) => {
  const [result] = await db.query(
    `
    DELETE FROM packages
    WHERE paket_id = ?
    `,
    [packageId],
  );

  return result.affectedRows;
};

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
};
