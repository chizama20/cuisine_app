import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipeAPI } from './recipes.api';
import { formatRecipeData } from './recipes.utils';
import useAuth from '../../hooks/useAuth';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/ui/Button';
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

  // Cook Mode state
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
        setLoading(false);
      } catch (err) {
        setError('Recipe not found');
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

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

  // Loading state
  if (loading) {
    return (
      <PageLayout>
        <SkeletonCard />
        <SkeletonCard />
      </PageLayout>
    );
  }

  // Error state
  if (error || !recipe) {
    return (
      <PageLayout>
        <div className="detail-error">
          <h2 className="page-heading">Recipe Not Found</h2>
          <p className="content-text text-center">{error}</p>
          <div className="text-center mt-2">
            <Link to="/">Back to Home</Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout>
        {/* Hero Area */}
        <div className="detail-hero">
          <h1 className="detail-hero-title">{recipe.title}</h1>
          <p className="detail-hero-desc">{recipe.description}</p>
          <div className="detail-hero-meta">
            <span className="detail-hero-badge">{recipe.region}</span>
            <span className="detail-hero-badge">{recipe.country}</span>
            <span className="detail-hero-dot">&bull;</span>
            <span className="detail-hero-author">By {recipe.firstName} {recipe.lastName}</span>
            <span className="detail-hero-dot">&bull;</span>
            <span className="detail-hero-date">{recipe.createdAt}</span>
          </div>
        </div>

        {/* Ingredients Bar */}
        <div className="detail-ingredients">
          <h2 className="detail-section-title">Ingredients</h2>
          <div className="ingredients-grid">
            {ingredients.map((ing, i) => (
              <div key={i} className="ingredient-item">
                <span className="ingredient-bullet" />
                <span className="ingredient-name">{ing.name}</span>
                <span className="ingredient-amount">{ing.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps Section */}
        <div className="detail-steps">
          <h2 className="detail-section-title">Instructions</h2>
          {steps.map((step, i) => (
            <div key={i} className="step-card">
              <div className="step-circle">{step.step_number}</div>
              <p className="step-text">{step.instruction}</p>
            </div>
          ))}
        </div>

        {/* Start Cooking Button */}
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

      {/* Cook Mode Overlay */}
      {cookMode && (
        <div className="cook-overlay">
          <div className="cook-header">
            <h2 className="cook-title">{recipe.title}</h2>
            <span className="cook-counter">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button className="cook-exit-btn" onClick={() => setCookMode(false)}>
              Exit
            </button>
          </div>

          <div className="cook-body">
            <div className="cook-step-number">{steps[currentStep]?.step_number}</div>
            <p className="cook-step-instruction">{steps[currentStep]?.instruction}</p>

            <button
              className="cook-ingredients-toggle"
              onClick={() => setShowIngredients(!showIngredients)}
            >
              {showIngredients ? 'Hide Ingredients' : 'Show Ingredients'}
            </button>

            {showIngredients && (
              <div className="cook-ingredients-panel">
                <h4>Ingredients</h4>
                {ingredients.map((ing, i) => (
                  <div key={i} className="cook-ingredient-item">
                    <span>{ing.name}</span>
                    <span>{ing.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="cook-footer">
            <button
              className="cook-nav-btn cook-nav-btn--prev"
              onClick={() => setCurrentStep(s => s - 1)}
              disabled={currentStep === 0}
            >
              Previous
            </button>

            <div className="cook-progress">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`cook-progress-dot ${
                    i === currentStep ? 'cook-progress-dot--active' :
                    i < currentStep ? 'cook-progress-dot--done' : ''
                  }`}
                />
              ))}
            </div>

            <button
              className="cook-nav-btn cook-nav-btn--next"
              onClick={() => setCurrentStep(s => s + 1)}
              disabled={currentStep === steps.length - 1}
            >
              Next Step
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeDetailPage;
