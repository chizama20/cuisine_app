const { query } = require('../config/db');

const getRecipe = async (req, res) => {
  const recipeID = req.params.id;

  const recipeSQL = `
    SELECT r.id, r.title, r.description, r.region, r.country, r.author_id, r.created_at,
           u.firstName, u.lastName
    FROM recipes r
    JOIN users u ON r.author_id = u.id
    WHERE r.id = ?`;
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

const updateRecipe = async (req, res) => {
  const recipeID = req.params.id;
  const { title, description, region, country, ingredients, steps } = req.body;

  if (!title || !description || !region || !country || !ingredients || !steps) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Verify ownership
    const ownerResult = await query('SELECT author_id FROM recipes WHERE id = ?', [recipeID]);
    if (ownerResult.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    if (ownerResult[0].author_id !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this recipe' });
    }

    // Update recipe fields
    await query(
      'UPDATE recipes SET title = ?, description = ?, region = ?, country = ? WHERE id = ?',
      [title, description, region, country, recipeID]
    );

    // Replace ingredients
    await query('DELETE FROM ingredients WHERE recipe_id = ?', [recipeID]);
    for (const ing of ingredients) {
      await query('INSERT INTO ingredients (recipe_id, name, amount) VALUES (?, ?, ?)', [recipeID, ing.name, ing.amount]);
    }

    // Replace steps
    await query('DELETE FROM steps WHERE recipe_id = ?', [recipeID]);
    for (const st of steps) {
      await query('INSERT INTO steps (recipe_id, step_number, instruction) VALUES (?, ?, ?)', [recipeID, st.step_number, st.instruction]);
    }

    res.json({ message: 'Recipe updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

const deleteRecipe = async (req, res) => {
  const recipeID = req.params.id;

  try {
    // Verify ownership
    const ownerResult = await query('SELECT author_id FROM recipes WHERE id = ?', [recipeID]);
    if (ownerResult.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    if (ownerResult[0].author_id !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    // ON DELETE CASCADE handles ingredients and steps
    await query('DELETE FROM recipes WHERE id = ?', [recipeID]);

    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

module.exports = { getRecipe, getAllRecipes, getRecipesByUser, createRecipe, updateRecipe, deleteRecipe };
