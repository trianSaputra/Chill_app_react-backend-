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
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const [orders] = await connection.query(
      `
      SELECT
        order_id,
        total_harga,
        status
      FROM orders
      WHERE order_id = ?
      FOR UPDATE
      `,
      [orderId],
    );

    if (orders.length === 0) {
      await connection.rollback();
      return null;
    }

    const order = orders[0];

    if (order.status !== "PENDING") {
      await connection.rollback();

      return {
        error: "ORDER_NOT_PENDING",
      };
    }

    const [pendingPayments] = await connection.query(
      `
      SELECT pembayaran_id
      FROM pembayaran
      WHERE order_id = ?
      AND status = 'PENDING'
      LIMIT 1
      `,
      [orderId],
    );

    if (pendingPayments.length > 0) {
      await connection.rollback();

      return {
        error: "PAYMENT_ALREADY_PENDING",
      };
    }

    const [result] = await connection.query(
      `
      INSERT INTO pembayaran
      (
        order_id,
        metode_pembayaran,
        status,
        jumlah_bayar
      )
      VALUES (?, ?, 'PENDING', ?)
      `,
      [orderId, metodePembayaran, order.total_harga],
    );

    await connection.commit();

    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const successPembayaran = async (pembayaranId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `
      SELECT
        p.pembayaran_id,
        p.order_id,
        p.status AS pembayaran_status,
        o.status AS order_status
      FROM pembayaran p
      JOIN orders o
        ON p.order_id = o.order_id
      WHERE p.pembayaran_id = ?
      FOR UPDATE
      `,
      [pembayaranId],
    );

    if (rows.length === 0) {
      await connection.rollback();
      return null;
    }

    const pembayaran = rows[0];

    if (pembayaran.pembayaran_status !== "PENDING") {
      await connection.rollback();

      return {
        error: "PAYMENT_NOT_PENDING",
      };
    }

    await connection.query(
      `
      UPDATE pembayaran
      SET
        status = 'SUCCESS',
        tanggal_bayar = NOW()
      WHERE pembayaran_id = ?
      `,
      [pembayaranId],
    );

    await connection.query(
      `
      UPDATE orders
      SET status = 'PAID'
      WHERE order_id = ?
      `,
      [pembayaran.order_id],
    );

    await connection.commit();

    return {
      pembayaran_id: pembayaran.pembayaran_id,
      order_id: pembayaran.order_id,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const failedPembayaran = async (pembayaranId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `
      SELECT
        p.pembayaran_id,
        p.order_id,
        p.status AS pembayaran_status,
        o.status AS order_status
      FROM pembayaran p
      JOIN orders o
        ON p.order_id = o.order_id
      WHERE p.pembayaran_id = ?
      FOR UPDATE
      `,
      [pembayaranId],
    );

    if (rows.length === 0) {
      await connection.rollback();
      return null;
    }

    const pembayaran = rows[0];

    if (pembayaran.pembayaran_status !== "PENDING") {
      await connection.rollback();

      return {
        error: "PAYMENT_NOT_PENDING",
      };
    }

    if (pembayaran.order_status !== "PENDING") {
      await connection.rollback();

      return {
        error: "ORDER_NOT_PENDING",
      };
    }

    await connection.query(
      `
      UPDATE pembayaran
      SET status = 'FAILED'
      WHERE pembayaran_id = ?
      `,
      [pembayaranId],
    );

    await connection.commit();

    return {
      pembayaran_id: pembayaran.pembayaran_id,
      order_id: pembayaran.order_id,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllPembayaran,
  getPembayaranById,
  createPembayaran,
  successPembayaran,
  failedPembayaran,
};
