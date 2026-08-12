const express = require("express");
const router = express.Router();
const seriesController = require("../controllers/series.controller");

router.get("/", seriesController.getAllSeries);

router.get("/:id", seriesController.getSeriesById);

router.post("/", seriesController.createSeries);

router.patch("/:id", seriesController.updateSeries);

router.delete("/:id", seriesController.deleteSeries);

module.exports = router;
