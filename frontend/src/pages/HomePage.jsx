import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { recipeAPI } from '../features/recipes/recipes.api';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';
import RegionBadge from '../components/ui/RegionBadge';
import SearchBar from '../components/ui/SearchBar';
import './HomePage.css';

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Initial fetch
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await recipeAPI.getAll();
        setRecipes(res.data);
      } catch (err) {
        // Silently fail — show empty state
      }
      setLoading(false);
    };
    fetchRecipes();
  }, []);

  // Search handler
  const handleSearch = async (params) => {
    const hasFilters = params.q || params.region || params.country;
    if (!hasFilters) {
      // Reset to all recipes
      try {
        const res = await recipeAPI.getAll();
        setRecipes(res.data);
      } catch (err) { /* ignore */ }
      setSearching(false);
      return;
    }

    setSearching(true);
    try {
      const res = await recipeAPI.search(params);
      setRecipes(res.data);
    } catch (err) { /* ignore */ }
    setSearching(false);
  };

  // Derive unique regions and countries for filter dropdowns
  const regions = useMemo(() =>
    [...new Set(recipes.map(r => r.region).filter(Boolean))].sort(),
    [recipes]
  );
  const countries = useMemo(() =>
    [...new Set(recipes.map(r => r.country).filter(Boolean))].sort(),
    [recipes]
  );

  // Group recipes by region
  const recipesByRegion = useMemo(() => {
    const groups = {};
    recipes.forEach(r => {
      const key = r.region || 'Other';
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    });
    return groups;
  }, [recipes]);

  const featured = recipes[0];
  const recent = recipes.slice(0, 6);

  return (
    <PageLayout>
      {/* Hero */}
      <div className="home-hero">
        <h1 className="home-hero-title">
          Discover <span>Recipes</span> From Around the World
        </h1>
        <p className="home-hero-subtitle">
          Explore, create, and share your favorite dishes with the community.
        </p>
        <SearchBar onSearch={handleSearch} regions={regions} countries={countries} />
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="skeleton-grid">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && recipes.length === 0 && (
        <Card centered>
          <div className="home-empty">
            <div className="home-empty-icon">&#127859;</div>
            <p className="home-empty-text">
              {searching
                ? 'No recipes match your search. Try different keywords.'
                : 'No recipes yet. Be the first to share one!'}
            </p>
            <Link to="/create-recipe" className="home-empty-link">
              Create a Recipe
            </Link>
          </div>
        </Card>
      )}

      {/* Content */}
      {!loading && recipes.length > 0 && (
        <>
          {/* Featured Recipe */}
          {featured && (
            <Link to={`/recipes/${featured.id}`} className="featured-recipe">
              <span className="featured-label">Featured</span>
              <h2 className="featured-title">{featured.title}</h2>
              <p className="featured-desc">
                {featured.description?.length > 150
                  ? featured.description.slice(0, 150) + '...'
                  : featured.description}
              </p>
              <div className="featured-meta">
                <span className="featured-badge">{featured.region}</span>
                <span className="featured-author">
                  By {featured.firstName} {featured.lastName}
                </span>
              </div>
            </Link>
          )}

          {/* Recently Added */}
          <div className="home-section">
            <div className="home-section-header">
              <h2 className="home-section-title">Recently Added</h2>
              <span className="home-section-count">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="recipe-grid">
              {recent.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>

          {/* By Region */}
          {Object.keys(recipesByRegion).length > 1 && (
            <div className="home-section">
              <div className="home-section-header">
                <h2 className="home-section-title">Browse by Region</h2>
              </div>
              {Object.entries(recipesByRegion).map(([regionName, regionRecipes]) => (
                <div key={regionName} className="region-section">
                  <div className="region-section-header">
                    <RegionBadge region={regionName} />
                    <h3>{regionName}</h3>
                  </div>
                  <div className="recipe-grid">
                    {regionRecipes.slice(0, 4).map(recipe => (
                      <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
};

const RecipeCard = ({ recipe }) => (
  <Link to={`/recipes/${recipe.id}`} className="recipe-card-link">
    <Card className="recipe-card" variant="hoverable">
      <div className="recipe-card-header">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        <RegionBadge region={recipe.region} />
      </div>
      {recipe.description && (
        <p className="recipe-card-desc">{recipe.description}</p>
      )}
      <div className="recipe-card-footer">
        <span className="recipe-card-author">
          By {recipe.firstName} {recipe.lastName}
        </span>
        <span className="recipe-card-country">{recipe.country}</span>
      </div>
    </Card>
  </Link>
);

export default HomePage;
