const db = require("../config/db");

const getAllOrders = async (userId) => {
  const [rows] = await db.query(
    `
    SELECT
      o.order_id,
      o.user_id,
      o.paket_id,
      p.nama_paket,
      o.total_harga,
      o.tanggal_order,
      o.expired_date,
      o.status,
      o.created_at
    FROM orders o
    JOIN packages p
      ON o.paket_id = p.paket_id
      where o.user_id = ?
    ORDER BY o.created_at DESC
  `,
    [userId],
  );

  return rows;
};

const getOrderById = async (orderId, userId) => {
  const [rows] = await db.query(
    `
    SELECT
      o.order_id,
      o.user_id,
      o.paket_id,
      p.nama_paket,
      o.total_harga,
      o.tanggal_order,
      o.expired_date,
      o.status,
      o.created_at
    FROM orders o
    JOIN packages p
      ON o.paket_id = p.paket_id
    WHERE o.order_id = ? AND o.user_id = ?
    `,
    [orderId, userId],
  );

  return rows[0];
};

const createOrder = async (userId, paketId) => {
  // Ambil harga paket
  const [packages] = await db.query(
    `
    SELECT
      paket_id,
      harga
    FROM packages
    WHERE paket_id = ?
    `,
    [paketId],
  );

  if (packages.length === 0) {
    return null;
  }

  const totalHarga = packages[0].harga;

  const [result] = await db.query(
    `
    INSERT INTO orders
    (
      user_id,
      paket_id,
      total_harga
    )
    VALUES (?, ?, ?)
    `,
    [userId, paketId, totalHarga],
  );

  return result.insertId;
};

const cancelOrder = async (orderId, userId) => {
  const [result] = await db.query(
    `
    UPDATE orders
    SET status = 'CANCELLED'
    WHERE order_id = ? AND user_id = ?
      AND status = 'PENDING'
    `,
    [orderId, userId],
  );

  return result.affectedRows;
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  cancelOrder,
};
