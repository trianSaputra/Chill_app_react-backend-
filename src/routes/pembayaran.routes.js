const express = require("express");
const pembayaranController = require("../controllers/pembayaran.controller");

const router = express.Router();

router.get("/", pembayaranController.getAllPembayaran);
router.get("/:id", pembayaranController.getPembayaranById);
router.post("/", pembayaranController.createPembayaran);
router.patch("/:id/success", pembayaranController.successPembayaran);
router.patch("/:id/failed", pembayaranController.failedPembayaran);

module.exports = router;
