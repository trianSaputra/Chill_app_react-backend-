const express = require("express");
const router = express.Router();
const packagesController = require("../controllers/packages.controller");

router.get("/", packagesController.getAllPackages);

router.get("/:id", packagesController.getPackageById);

router.post("/", packagesController.createPackage);

router.patch("/:id", packagesController.updatePackage);

router.delete("/:id", packagesController.deletePackage);

module.exports = router;
