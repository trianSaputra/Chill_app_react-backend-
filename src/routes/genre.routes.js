const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genre.controller");

router.get("/", genreController.getAllGenres);

router.get("/:id", genreController.getGenreById);

router.post("/", genreController.createGenre);

router.patch("/:id", genreController.updateGenre);

router.delete("/:id", genreController.deleteGenre);

module.exports = router;
