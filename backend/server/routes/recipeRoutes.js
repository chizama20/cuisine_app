const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { getRecipe, getAllRecipes, getRecipesByUser, createRecipe, updateRecipe, deleteRecipe, searchRecipes } = require('../controllers/recipesController');

// GET /api/recipes — all recipes (public)
router.get('/', getAllRecipes);

// GET /api/recipes/search — search/filter recipes (public)
router.get('/search', searchRecipes);

// GET /api/recipes/user/:userId — recipes by user (protected)
router.get('/user/:userId', authenticateToken, getRecipesByUser);

// GET /api/recipes/:id — single recipe (public)
router.get('/:id', getRecipe);

// POST /api/recipes — create recipe (protected)
router.post('/', authenticateToken, createRecipe);

// PUT /api/recipes/:id — update recipe (protected, owner only)
router.put('/:id', authenticateToken, updateRecipe);

// DELETE /api/recipes/:id — delete recipe (protected, owner only)
router.delete('/:id', authenticateToken, deleteRecipe);

module.exports = router;
