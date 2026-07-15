const express = require("express");
const router = express.Router();
const { createRecipes } = require("../controllers/recipeController");
const { generateLimiter } = require("../middleware/rateLimiter");

router.post("/generate-recipes", generateLimiter, createRecipes);

module.exports = router;