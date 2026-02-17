import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipeAPI } from './recipes.api';
import { formatRecipeData } from './recipes.utils';
import useAuth from '../../hooks/useAuth';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
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
    if (!window.confirm('Are you sure you want to delete this recipe? This cannot be undone.')) {
      return;
    }

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
        <div className="loading">Loading...</div>
      </PageLayout>
    );
  }

  if (error || !recipe) {
    return (
      <PageLayout>
        <div className="recipe-detail-error">
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
    <PageLayout>
      <div className="recipe-detail">
        <div className="recipe-detail-header">
          <h1 className="page-heading">{recipe.title}</h1>
          <div className="recipe-meta">
            <span className="recipe-meta-item">{recipe.region}, {recipe.country}</span>
            <span className="recipe-meta-item">By {recipe.firstName} {recipe.lastName}</span>
            <span className="recipe-meta-item">{recipe.createdAt}</span>
          </div>
        </div>

        <Card>
          <p className="content-text">{recipe.description}</p>
        </Card>

        <Card>
          <h3 className="section-title">Ingredients</h3>
          <ul className="recipe-ingredients">
            {ingredients.map((ing, i) => (
              <li key={i} className="recipe-ingredient">
                <span className="ingredient-name">{ing.name}</span>
                <span className="ingredient-amount">{ing.amount}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="section-title">Instructions</h3>
          <ol className="recipe-steps">
            {steps.map((step, i) => (
              <li key={i} className="recipe-step">
                <span className="step-num">{step.step_number}</span>
                <p>{step.instruction}</p>
              </li>
            ))}
          </ol>
        </Card>

        {isOwner && (
          <div className="recipe-actions">
            <Button variant="secondary" onClick={() => navigate(`/recipes/${id}/edit`)}>
              Edit Recipe
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Recipe
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default RecipeDetailPage;
