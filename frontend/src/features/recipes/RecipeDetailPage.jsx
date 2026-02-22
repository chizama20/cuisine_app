import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipeAPI } from './recipes.api';
import { formatRecipeData } from './recipes.utils';
import useAuth from '../../hooks/useAuth';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/ui/Button';
import RegionBadge from '../../components/ui/RegionBadge';
import { SkeletonCard } from '../../components/ui/Skeleton';
import './RecipeDetailPage.css';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [cookMode, setCookMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await recipeAPI.getById(id);
        setRecipe(formatRecipeData(res.data.recipe));
        setIngredients(res.data.ingredients);
        setSteps(res.data.steps);
      } catch (err) {
        setError('Recipe not found');
      }
      setLoading(false);
    };
    fetchRecipe();
  }, [id]);

  // Lock body scroll in cook mode
  useEffect(() => {
    document.body.style.overflow = cookMode ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cookMode]);

  // Keyboard navigation in cook mode
  useEffect(() => {
    if (!cookMode) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight' && currentStep < steps.length - 1)
        setCurrentStep(s => s + 1);
      if (e.key === 'ArrowLeft' && currentStep > 0)
        setCurrentStep(s => s - 1);
      if (e.key === 'Escape')
        setCookMode(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cookMode, currentStep, steps.length]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe? This cannot be undone.')) return;
    try {
      await recipeAPI.delete(id);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete recipe');
    }
  };

  const isOwner = user && recipe && user.userId === recipe.author_id;

  if (loading) {
    return (
      <PageLayout>
        <SkeletonCard />
        <SkeletonCard />
      </PageLayout>
    );
  }

  if (error || !recipe) {
    return (
      <PageLayout>
        <div className="detail-error">
          <h2 className="detail-error-title">Recipe Not Found</h2>
          <p className="detail-error-text">{error}</p>
          <Link to="/" className="detail-error-link">← Back to Home</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout>
        {/* Hero */}
        <div className="detail-hero">
          <h1 className="detail-title">{recipe.title}</h1>
          {recipe.description && (
            <p className="detail-desc">{recipe.description}</p>
          )}
          <div className="detail-meta">
            {recipe.region && <RegionBadge region={recipe.region} />}
            {recipe.country && (
              <span className="detail-meta-item">{recipe.country}</span>
            )}
            <span className="detail-meta-dot">&middot;</span>
            <span className="detail-meta-item">
              By {recipe.firstName} {recipe.lastName}
            </span>
            <span className="detail-meta-dot">&middot;</span>
            <span className="detail-meta-item">{recipe.createdAt}</span>
          </div>
        </div>

        {/* Ingredients */}
        {ingredients.length > 0 && (
          <section className="detail-section">
            <h2 className="detail-section-title">Ingredients</h2>
            <div className="ingredients-chips">
              {ingredients.map((ing, i) => (
                <div key={i} className="ingredient-chip">
                  <span className="ingredient-chip-name">{ing.name}</span>
                  <span className="ingredient-chip-sep">&middot;</span>
                  <span className="ingredient-chip-amount">{ing.amount}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Steps */}
        {steps.length > 0 && (
          <section className="detail-section">
            <h2 className="detail-section-title">Instructions</h2>
            <ol className="steps-list">
              {steps.map((step, i) => (
                <li key={i} className="step-row">
                  <span className="step-num">
                    {String(step.step_number).padStart(2, '0')}
                  </span>
                  <p className="step-text">{step.instruction}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Start Cooking */}
        {steps.length > 0 && (
          <button
            className="detail-cook-btn"
            onClick={() => { setCookMode(true); setCurrentStep(0); setShowIngredients(false); }}
          >
            Start Cooking
          </button>
        )}

        {/* Owner Actions */}
        {isOwner && (
          <div className="detail-actions">
            <Button variant="secondary" onClick={() => navigate(`/recipes/${id}/edit`)}>
              Edit Recipe
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Recipe
            </Button>
          </div>
        )}
      </PageLayout>

      {/* Cook Mode */}
      {cookMode && (
        <div className="cook-overlay">
          {/* Top bar */}
          <div className="cook-topbar">
            <span className="cook-brand">Cuisine</span>
            <span className="cook-recipe-name">{recipe.title}</span>
            <button className="cook-exit" onClick={() => setCookMode(false)}>
              Exit
            </button>
          </div>

          {/* Main */}
          <div className="cook-main">
            <div className="cook-step-num">
              {String(steps[currentStep]?.step_number).padStart(2, '0')}
            </div>
            <p className="cook-instruction">
              {steps[currentStep]?.instruction}
            </p>

            <button
              className="cook-ing-toggle"
              onClick={() => setShowIngredients(v => !v)}
            >
              {showIngredients ? 'Hide Ingredients' : 'Show Ingredients'}
            </button>

            {showIngredients && (
              <div className="cook-ing-panel">
                {ingredients.map((ing, i) => (
                  <div key={i} className="cook-ing-row">
                    <span>{ing.name}</span>
                    <span>{ing.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer nav */}
          <div className="cook-footer">
            <button
              className="cook-nav cook-nav--prev"
              onClick={() => setCurrentStep(s => s - 1)}
              disabled={currentStep === 0}
            >
              ← Previous
            </button>

            <div className="cook-dots">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`cook-dot ${
                    i === currentStep ? 'cook-dot--active' :
                    i < currentStep  ? 'cook-dot--done' : ''
                  }`}
                />
              ))}
            </div>

            <button
              className="cook-nav cook-nav--next"
              onClick={() => setCurrentStep(s => s + 1)}
              disabled={currentStep === steps.length - 1}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeDetailPage;
