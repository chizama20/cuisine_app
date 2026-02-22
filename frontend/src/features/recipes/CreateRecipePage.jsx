import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../profile/profile.api';
import { recipeAPI } from './recipes.api';
import useAuth from '../../hooks/useAuth';
import PageLayout from '../../components/layout/PageLayout';
import Input from '../../components/ui/Input';
import './CreateRecipe.css';

const CreateRecipePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', amount: '' }]);
  const [steps, setSteps] = useState([{ step_number: 1, instruction: '' }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await userAPI.getProfile();
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile. Please log in again.');
        setLoading(false);
        setTimeout(() => navigate('/login'), 2000);
      }
    };
    fetchProfile();
  }, [navigate]);

  const addIngredient = () => setIngredients([...ingredients, { name: '', amount: '' }]);

  const removeIngredient = (index) => {
    if (ingredients.length > 1)
      setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addStep = () =>
    setSteps([...steps, { step_number: steps.length + 1, instruction: '' }]);

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

    if (ingredients.some(ing => !ing.name || !ing.amount)) {
      setError('Please fill in all ingredient fields.');
      return;
    }
    if (steps.some(step => !step.instruction)) {
      setError('Please fill in all step instructions.');
      return;
    }

    try {
      const res = await recipeAPI.create({ title, description, region, country, ingredients, steps });
      if (res.status === 201) navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create recipe. Please try again.');
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
      <div className="rform-header">
        <h1 className="rform-heading">Create a Recipe</h1>
        <p className="rform-subheading">Share your culinary creation with the community.</p>
      </div>

      <form className="rform" onSubmit={handleSubmit}>
        {/* Details */}
        <div className="rform-section">
          <div className="rform-section-header">
            <h2 className="rform-section-title">Recipe Details</h2>
          </div>

          <Input
            label="Title"
            type="text"
            placeholder="e.g., Pasta Carbonara"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <Input
            label="Description"
            type="textarea"
            placeholder="What makes this recipe special..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
          <div className="rform-two-col">
            <Input
              label="Region"
              type="text"
              placeholder="e.g., Mediterranean"
              value={region}
              onChange={e => setRegion(e.target.value)}
              required
            />
            <Input
              label="Country"
              type="text"
              placeholder="e.g., Italy"
              value={country}
              onChange={e => setCountry(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Ingredients */}
        <div className="rform-section">
          <div className="rform-section-header">
            <h2 className="rform-section-title">Ingredients</h2>
            <button type="button" className="rform-add-btn" onClick={addIngredient}>
              + Add
            </button>
          </div>

          <div className="rform-ing-list">
            {ingredients.map((ing, index) => (
              <div key={index} className="rform-ing-row">
                <span className="rform-ing-num">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <input
                  className="rform-input"
                  type="text"
                  placeholder="Ingredient name"
                  value={ing.name}
                  onChange={e => handleIngredientChange(index, 'name', e.target.value)}
                  required
                />
                <input
                  className="rform-input"
                  type="text"
                  placeholder="Amount"
                  value={ing.amount}
                  onChange={e => handleIngredientChange(index, 'amount', e.target.value)}
                  required
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    className="rform-remove-btn"
                    onClick={() => removeIngredient(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="rform-section">
          <div className="rform-section-header">
            <h2 className="rform-section-title">Instructions</h2>
            <button type="button" className="rform-add-btn" onClick={addStep}>
              + Add Step
            </button>
          </div>

          <div className="rform-steps-list">
            {steps.map((step, index) => (
              <div key={index} className="rform-step-row">
                <div className="rform-step-header">
                  <span className="rform-step-num">
                    {String(step.step_number).padStart(2, '0')}
                  </span>
                  {steps.length > 1 && (
                    <button
                      type="button"
                      className="rform-remove-btn"
                      onClick={() => removeStep(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <textarea
                  className="rform-textarea"
                  placeholder={`Describe step ${step.step_number}...`}
                  value={step.instruction}
                  onChange={e => handleStepChange(index, e.target.value)}
                  required
                  rows={3}
                />
              </div>
            ))}
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="rform-submit-btn">
          Create Recipe
        </button>
      </form>
    </PageLayout>
  );
};

export default CreateRecipePage;
