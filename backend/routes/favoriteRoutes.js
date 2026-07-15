const express = require("express");
const router = express.Router();
const {
  saveFavorite,
  getFavorites,
  deleteFavorite,
} = require("../controllers/favoriteController");

router.post("/favorites", saveFavorite);
router.get("/favorites", getFavorites);
router.delete("/favorites/:id", deleteFavorite);

module.exports = router;