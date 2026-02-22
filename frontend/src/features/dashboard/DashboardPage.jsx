import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { recipeAPI } from '../recipes/recipes.api';
import useAuth from '../../hooks/useAuth';
import PageLayout from '../../components/layout/PageLayout';
import { SkeletonCard } from '../../components/ui/Skeleton';
import RegionBadge from '../../components/ui/RegionBadge';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      if (!user?.userId) return;
      try {
        const res = await recipeAPI.getByUser(user.userId);
        setRecipes(res.data);
      } catch (err) {
        // Silently fail
      }
      setLoading(false);
    };
    fetchMyRecipes();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    try {
      await recipeAPI.delete(id);
      setRecipes(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert('Failed to delete recipe.');
    }
  };

  const stats = useMemo(() => {
    const regionSet = new Set(recipes.map(r => r.region).filter(Boolean));
    return {
      total: recipes.length,
      regions: regionSet.size,
      latestTitle: recipes[0]?.title || null,
    };
  }, [recipes]);

  return (
    <PageLayout>
      {/* Greeting + CTA */}
      <div className="dash-header">
        <h1 className="dash-greeting">
          Welcome back, {user?.firstName || 'Chef'}.
        </h1>
        <button className="dash-new-btn" onClick={() => navigate('/create-recipe')}>
          + New Recipe
        </button>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        <div className="dash-stat">
          <p className="dash-stat-value">{loading ? '—' : stats.total}</p>
          <p className="dash-stat-label">Recipes</p>
        </div>
        <div className="dash-stat">
          <p className="dash-stat-value">{loading ? '—' : stats.regions}</p>
          <p className="dash-stat-label">Regions</p>
        </div>
        <div className="dash-stat dash-stat--wide">
          <p className="dash-stat-value dash-stat-value--title">
            {loading ? '—' : (stats.latestTitle || 'None yet')}
          </p>
          <p className="dash-stat-label">Latest Recipe</p>
        </div>
      </div>

      {/* Section header */}
      <div className="dash-section-header">
        <h2 className="dash-section-title">My Recipes</h2>
        {!loading && recipes.length > 0 && (
          <span className="dash-section-count">
            {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="dash-grid">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && recipes.length === 0 && (
        <div className="dash-empty">
          <p className="dash-empty-text">You haven't created any recipes yet.</p>
          <button className="dash-new-btn" onClick={() => navigate('/create-recipe')}>
            Create Your First Recipe
          </button>
        </div>
      )}

      {/* Recipe grid */}
      {!loading && recipes.length > 0 && (
        <div className="dash-grid">
          {recipes.map(recipe => (
            <article key={recipe.id} className="dash-card">
              {/* Card body */}
              <div className="dash-card-body">
                <h3 className="dash-card-title">{recipe.title}</h3>
                <div className="dash-card-meta">
                  <span className="dash-card-date">
                    {new Date(recipe.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                  <RegionBadge region={recipe.region} />
                </div>
              </div>

              {/* Card actions */}
              <div className="dash-card-actions">
                <Link to={`/recipes/${recipe.id}`} className="dash-action-link">
                  View
                </Link>
                <Link to={`/recipes/${recipe.id}/edit`} className="dash-action-link dash-action-link--edit">
                  Edit
                </Link>
                <button
                  className="dash-action-link dash-action-link--delete"
                  onClick={() => handleDelete(recipe.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default DashboardPage;
