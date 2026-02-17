import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipeAPI } from '../features/recipes/recipes.api';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/ui/Card';
import './HomePage.css';

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await recipeAPI.getAll();
        setRecipes(res.data);
      } catch (err) {
        // Silently fail — just show empty state
      }
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  return (
    <PageLayout>
      <div className="home-hero">
        <h1 className="page-heading">RecipeApp</h1>
        <p className="content-text text-center">
          Discover, create, and share your favorite recipes with the community.
        </p>
      </div>

      <h2 className="section-title">Latest Recipes</h2>

      {loading && <div className="loading">Loading recipes...</div>}

      {!loading && recipes.length === 0 && (
        <Card centered>
          <p className="content-text">No recipes yet. Be the first to share one!</p>
        </Card>
      )}

      {!loading && recipes.length > 0 && (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="recipe-card-link">
              <Card className="recipe-card">
                <h3 className="recipe-card-title">{recipe.title}</h3>
                <div className="recipe-card-meta">
                  <span>{recipe.region}, {recipe.country}</span>
                </div>
                <p className="recipe-card-author">
                  By {recipe.firstName} {recipe.lastName}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default HomePage;
