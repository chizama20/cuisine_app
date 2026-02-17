const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { getRecipe, getAllRecipes, getRecipesByUser, createRecipe } = require('../controllers/recipesController');

// GET /api/recipes — all recipes (public)
router.get('/', getAllRecipes);

// GET /api/recipes/user/:userId — recipes by user (protected)
router.get('/user/:userId', authenticateToken, getRecipesByUser);

// GET /api/recipes/:id — single recipe (public)
router.get('/:id', getRecipe);

// POST /api/recipes — create recipe (protected)
router.post('/', authenticateToken, createRecipe);

module.exports = router;
