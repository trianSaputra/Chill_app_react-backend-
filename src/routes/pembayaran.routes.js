const express = require("express");
const pembayaranController = require("../controllers/pembayaran.controller");

const router = express.Router();

router.get("/", pembayaranController.getAllPembayaran);
router.get("/:id", pembayaranController.getPembayaranById);
router.post("/", pembayaranController.createPembayaran);

module.exports = router;
