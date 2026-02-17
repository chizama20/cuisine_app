import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeAPI } from './recipes.api';
import useAuth from '../../hooks/useAuth';
import PageLayout from '../../components/layout/PageLayout';
import './CreateRecipe.css';

const EditRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', amount: '' }]);
  const [steps, setSteps] = useState([{ step_number: 1, instruction: '' }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await recipeAPI.getById(id);
        const recipe = res.data.recipe;

        // Verify ownership
        if (user && recipe.author_id !== user.userId) {
          navigate(`/recipes/${id}`);
          return;
        }

        setTitle(recipe.title);
        setDescription(recipe.description);
        setRegion(recipe.region);
        setCountry(recipe.country);
        setIngredients(res.data.ingredients.length > 0 ? res.data.ingredients : [{ name: '', amount: '' }]);
        setSteps(res.data.steps.length > 0 ? res.data.steps : [{ step_number: 1, instruction: '' }]);
        setLoading(false);
      } catch (err) {
        setError('Failed to load recipe');
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user, navigate]);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '' }]);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addStep = () => {
    setSteps([...steps, { step_number: steps.length + 1, instruction: '' }]);
  };

  const removeStep = (index) => {
    if (steps.length > 1) {
      const updated = steps.filter((_, i) => i !== index);
      updated.forEach((step, i) => { step.step_number = i + 1; });
      setSteps(updated);
    }
  };

  const handleStepChange = (index, value) => {
    const updated = [...steps];
    updated[index].instruction = value;
    setSteps(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const hasEmptyIngredients = ingredients.some(ing => !ing.name || !ing.amount);
    const hasEmptySteps = steps.some(step => !step.instruction);

    if (hasEmptyIngredients) {
      setError('Please fill in all ingredient fields');
      return;
    }
    if (hasEmptySteps) {
      setError('Please fill in all step instructions');
      return;
    }

    try {
      const recipeData = { title, description, region, country, ingredients, steps };
      const res = await recipeAPI.update(id, recipeData);
      if (res.status === 200) {
        navigate(`/recipes/${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update recipe. Please try again.');
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="loading">Loading...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="create-recipe-container">
        <div className="content-wrapper">
          <div className="header">
            <h1>Edit Recipe</h1>
            <p>Update your recipe details</p>
          </div>

          <form onSubmit={handleSubmit} className="recipe-form">
            <div className="form-section">
              <h2>Recipe Details</h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Recipe Title *</label>
                  <input type="text" placeholder="Enter recipe title" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea placeholder="Describe your recipe" value={description} onChange={e => setDescription(e.target.value)} required rows="4" />
                </div>
                <div className="form-group">
                  <label>Region *</label>
                  <input type="text" placeholder="e.g., Mediterranean" value={region} onChange={e => setRegion(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Country *</label>
                  <input type="text" placeholder="e.g., Italy" value={country} onChange={e => setCountry(e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <h2>Ingredients</h2>
                <button type="button" onClick={addIngredient} className="btn btn-add">+ Add Ingredient</button>
              </div>
              <div className="ingredients-list">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-item">
                    <div className="ingredient-number">{index + 1}</div>
                    <div className="ingredient-fields">
                      <input type="text" placeholder="Ingredient name" value={ingredient.name} onChange={e => handleIngredientChange(index, 'name', e.target.value)} required />
                      <input type="text" placeholder="Amount (e.g., 2 cups)" value={ingredient.amount} onChange={e => handleIngredientChange(index, 'amount', e.target.value)} required className="amount-input" />
                    </div>
                    {ingredients.length > 1 && (
                      <button type="button" onClick={() => removeIngredient(index)} className="btn btn-remove" title="Remove ingredient">x</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <h2>Instructions</h2>
                <button type="button" onClick={addStep} className="btn btn-add">+ Add Step</button>
              </div>
              <div className="steps-list">
                {steps.map((step, index) => (
                  <div key={index} className="step-item">
                    <div className="step-number">{step.step_number}</div>
                    <div className="step-content">
                      <textarea placeholder={`Describe step ${step.step_number}`} value={step.instruction} onChange={e => handleStepChange(index, e.target.value)} required rows="3" />
                    </div>
                    {steps.length > 1 && (
                      <button type="button" onClick={() => removeStep(index)} className="btn btn-remove" title="Remove step">x</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span>Error:</span> {error}
              </div>
            )}

            <button type="submit" className="btn btn-submit">Update Recipe</button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default EditRecipePage;
