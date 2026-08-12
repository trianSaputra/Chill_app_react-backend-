const express = require("express");
const daftarSayaController = require("../controllers/daftarSaya.controller");

const router = express.Router();

router.get("/", daftarSayaController.getAllDaftarSaya);
router.post("/", daftarSayaController.createDaftarSaya);
router.delete("/:id", daftarSayaController.deleteDaftarSaya);

module.exports = router;
