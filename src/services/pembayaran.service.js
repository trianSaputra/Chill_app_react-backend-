const db = require("../config/db");

const getAllPembayaran = async (userId) => {
  const [rows] = await db.query(
    `
    SELECT
      p.pembayaran_id,
      p.order_id,
      o.paket_id,
      pk.nama_paket,
      p.metode_pembayaran,
      p.status,
      p.tanggal_bayar,
      p.jumlah_bayar,
      p.created_at
    FROM pembayaran p
    JOIN orders o
      ON p.order_id = o.order_id
    JOIN packages pk
      ON o.paket_id = pk.paket_id
    WHERE o.user_id = ?
    ORDER BY p.pembayaran_id DESC
    `,
    [userId],
  );

  return rows;
};

const getPembayaranById = async (pembayaranId, userId) => {
  const [rows] = await db.query(
    `
    SELECT
      p.pembayaran_id,
      p.order_id,
      o.paket_id,
      pk.nama_paket,
      p.metode_pembayaran,
      p.status,
      p.tanggal_bayar,
      p.jumlah_bayar,
      p.created_at
    FROM pembayaran p
    JOIN orders o
      ON p.order_id = o.order_id
    JOIN packages pk
      ON o.paket_id = pk.paket_id
    WHERE p.pembayaran_id = ?
      AND o.user_id = ?
    `,
    [pembayaranId, userId],
  );

  return rows[0];
};

const createPembayaran = async (orderId, metodePembayaran) => {
  const [orders] = await db.query(
    `
    SELECT
      order_id,
      total_harga,
      status
    FROM orders
    WHERE order_id = ?
    `,
    [orderId],
  );

  if (orders.length === 0) {
    return null;
  }

  const order = orders[0];

  if (order.status !== "PENDING") {
    return {
      error: "ORDER_NOT_PENDING",
    };
  }

  const [existingPayment] = await db.query(
    `
    SELECT pembayaran_id
    FROM pembayaran
    WHERE order_id = ?
    `,
    [orderId],
  );

  if (existingPayment.length > 0) {
    return {
      error: "PAYMENT_ALREADY_EXISTS",
    };
  }

  const [result] = await db.query(
    `
    INSERT INTO pembayaran
    (
      order_id,
      metode_pembayaran,
      jumlah_bayar
    )
    VALUES (?, ?, ?)
    `,
    [orderId, metodePembayaran, order.total_harga],
  );

  return result.insertId;
};

module.exports = {
  getAllPembayaran,
  getPembayaranById,
  createPembayaran,
};
