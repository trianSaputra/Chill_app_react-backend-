const express = require("express");
const episodesController = require("../controllers/episodes.controller");

const router = express.Router();

router.get("/", episodesController.getAllEpisodes);
router.get("/:id", episodesController.getEpisodeById);
router.post("/", episodesController.createEpisode);
router.patch("/:id", episodesController.updateEpisode);
router.delete("/:id", episodesController.deleteEpisode);

module.exports = router;
