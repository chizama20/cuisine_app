const { query } = require('../config/db');

const getRecipe = async (req, res) => {
  const recipeID = req.params.id;

  const recipeSQL = 'SELECT id, title, description, region, country, author_id, created_at FROM recipes WHERE id = ?';
  const ingredientsSQL = 'SELECT name, amount FROM ingredients WHERE recipe_id = ?';
  const stepsSQL = 'SELECT step_number, instruction FROM steps WHERE recipe_id = ? ORDER BY step_number ASC';

  try {
    const recipeResults = await query(recipeSQL, [recipeID]);
    if (recipeResults.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const ingredientResults = await query(ingredientsSQL, [recipeID]);
    const stepResults = await query(stepsSQL, [recipeID]);

    res.json({
      recipe: recipeResults[0],
      ingredients: ingredientResults,
      steps: stepResults
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

const getAllRecipes = async (req, res) => {
  const sql = 'SELECT r.*, u.firstName, u.lastName FROM recipes r JOIN users u ON r.author_id = u.id ORDER BY r.created_at DESC';

  try {
    const results = await query(sql);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

const getRecipesByUser = async (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT r.*, u.firstName, u.lastName FROM recipes r JOIN users u ON r.author_id = u.id WHERE r.author_id = ? ORDER BY r.created_at DESC';

  try {
    const results = await query(sql, [userId]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

const createRecipe = async (req, res) => {
  const { title, description, region, country, ingredients, steps } = req.body;
  const author_id = req.user.userId;

  if (!title || !description || !region || !country || !ingredients || !steps) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const recipeSQL = 'INSERT INTO recipes (title, description, region, country, author_id) VALUES (?, ?, ?, ?, ?)';
    const recipeResult = await query(recipeSQL, [title, description, region, country, author_id]);
    const recipeID = recipeResult.insertId;

    const ingredientsSQL = 'INSERT INTO ingredients (recipe_id, name, amount) VALUES (?, ?, ?)';
    for (const ing of ingredients) {
      await query(ingredientsSQL, [recipeID, ing.name, ing.amount]);
    }

    const stepsSQL = 'INSERT INTO steps (recipe_id, step_number, instruction) VALUES (?, ?, ?)';
    for (const st of steps) {
      await query(stepsSQL, [recipeID, st.step_number, st.instruction]);
    }

    res.status(201).json({ message: 'Recipe created successfully', recipe_id: recipeID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

module.exports = { getRecipe, getAllRecipes, getRecipesByUser, createRecipe };
