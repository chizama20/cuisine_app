import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { recipeAPI } from '../recipes/recipes.api';
import useAuth from '../../hooks/useAuth';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
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

  // Compute stats
  const stats = useMemo(() => {
    const regionSet = new Set(recipes.map(r => r.region).filter(Boolean));
    const latest = recipes[0];
    return {
      total: recipes.length,
      regions: regionSet.size,
      latestTitle: latest?.title || 'None yet'
    };
  }, [recipes]);

  return (
    <PageLayout>
      {/* Welcome Header */}
      <div className="dash-header">
        <h1 className="dash-greeting">
          Welcome back, <span>{user?.firstName || 'Chef'}</span>!
        </h1>
        <p className="dash-subtext">Here's what's cooking in your kitchen.</p>
      </div>

      {/* Stats Bar */}
      <div className="dash-stats">
        <div className="dash-stat-card">
          <p className="dash-stat-value">{loading ? '-' : stats.total}</p>
          <p className="dash-stat-label">Total Recipes</p>
        </div>
        <div className="dash-stat-card">
          <p className="dash-stat-value">{loading ? '-' : stats.regions}</p>
          <p className="dash-stat-label">Regions Covered</p>
        </div>
        <div className="dash-stat-card">
          <p className="dash-stat-value" title={stats.latestTitle}>
            {loading ? '-' : (stats.latestTitle.length > 15 ? stats.latestTitle.slice(0, 15) + '...' : stats.latestTitle)}
          </p>
          <p className="dash-stat-label">Latest Recipe</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="dash-action-bar">
        <h2 className="dash-section-title">My Recipes</h2>
        <Button onClick={() => navigate('/create-recipe')}>
          + Create New Recipe
        </Button>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="dash-skeleton-grid">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty State */}
      {!loading && recipes.length === 0 && (
        <Card centered>
          <div className="dash-empty">
            <div className="dash-empty-icon">&#128221;</div>
            <p className="dash-empty-text">You haven't created any recipes yet.</p>
            <Button onClick={() => navigate('/create-recipe')}>
              Create Your First Recipe
            </Button>
          </div>
        </Card>
      )}

      {/* My Recipes Grid */}
      {!loading && recipes.length > 0 && (
        <div className="dash-recipes-grid">
          {recipes.map(recipe => (
            <Card key={recipe.id} className="dash-recipe-card">
              <div className="dash-recipe-header">
                <h3 className="dash-recipe-title">{recipe.title}</h3>
                <RegionBadge region={recipe.region} />
              </div>
              <p className="dash-recipe-date">
                {new Date(recipe.created_at).toLocaleDateString()}
              </p>
              <div className="dash-recipe-actions">
                <Link to={`/recipes/${recipe.id}`} className="dash-btn dash-btn--view">
                  View
                </Link>
                <Link to={`/recipes/${recipe.id}/edit`} className="dash-btn dash-btn--edit">
                  Edit
                </Link>
                <button
                  className="dash-btn dash-btn--delete"
                  onClick={() => handleDelete(recipe.id)}
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default DashboardPage;
