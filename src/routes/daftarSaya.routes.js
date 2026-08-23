const express = require("express");
const daftarSayaController = require("../controllers/daftarSaya.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware.verifyToken,
  daftarSayaController.getAllDaftarSaya,
);
router.post(
  "/",
  authMiddleware.verifyToken,
  daftarSayaController.createDaftarSaya,
);
router.delete("/:id", daftarSayaController.deleteDaftarSaya);

module.exports = router;
