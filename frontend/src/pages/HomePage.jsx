import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { recipeAPI } from '../features/recipes/recipes.api';
import PageLayout from '../components/layout/PageLayout';
import { SkeletonCard } from '../components/ui/Skeleton';
import RegionBadge from '../components/ui/RegionBadge';
import SearchBar from '../components/ui/SearchBar';
import './HomePage.css';

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

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

  const handleSearch = async (params) => {
    const hasFilters = params.q || params.region || params.country;
    if (!hasFilters) {
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

  const regions = useMemo(() =>
    [...new Set(recipes.map(r => r.region).filter(Boolean))].sort(),
    [recipes]
  );
  const countries = useMemo(() =>
    [...new Set(recipes.map(r => r.country).filter(Boolean))].sort(),
    [recipes]
  );
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

  const hero = (
    <div className="home-hero">
      <div className="home-hero-inner">
        <h1 className="home-hero-title">
          Discover Recipes<br />From Around the World.
        </h1>
        <p className="home-hero-subtitle">
          Explore, create, and share dishes from every corner of the globe.
        </p>
        <SearchBar
          onSearch={handleSearch}
          regions={regions}
          countries={countries}
          className="search-bar--hero"
        />
      </div>
    </div>
  );

  return (
    <PageLayout hero={hero}>
      {/* Loading */}
      {loading && (
        <div className="recipe-grid">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && recipes.length === 0 && (
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
      )}

      {/* Content */}
      {!loading && recipes.length > 0 && (
        <>
          {/* Featured */}
          {featured && (
            <Link to={`/recipes/${featured.id}`} className="featured-strip">
              <span className="featured-label">Featured Recipe</span>
              <h2 className="featured-title">{featured.title}</h2>
              <div className="featured-meta">
                {featured.region && <span className="featured-meta-item">{featured.region}</span>}
                {featured.country && <span className="featured-meta-item">{featured.country}</span>}
                <span className="featured-meta-dot">&middot;</span>
                <span className="featured-meta-item">By {featured.firstName} {featured.lastName}</span>
              </div>
              <span className="featured-cta">Read Recipe &rarr;</span>
            </Link>
          )}

          {/* Recently Added */}
          <div className="home-section">
            <div className="home-section-header">
              <h2 className="home-section-title">Recently Added</h2>
              <span className="home-section-count">
                {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
              </span>
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
                    <h3 className="region-section-name">{regionName}</h3>
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
    <article className="recipe-card">
      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        {recipe.description && (
          <p className="recipe-card-desc">{recipe.description}</p>
        )}
      </div>
      <footer className="recipe-card-footer">
        <span className="recipe-card-author">
          {recipe.firstName} {recipe.lastName}
        </span>
        <RegionBadge region={recipe.region} />
      </footer>
    </article>
  </Link>
);

export default HomePage;
