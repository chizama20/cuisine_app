import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import HomePage from '../pages/HomePage';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import ProfilePage from '../features/profile/ProfilePage';
import CreateRecipePage from '../features/recipes/CreateRecipePage';
import RecipeDetailPage from '../features/recipes/RecipeDetailPage';
import EditRecipePage from '../features/recipes/EditRecipePage';
import ProtectedRoute from './ProtectedRoute';

function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />

        {/* Private routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-recipe"
          element={
            <ProtectedRoute>
              <CreateRecipePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recipes/:id/edit"
          element={
            <ProtectedRoute>
              <EditRecipePage />
            </ProtectedRoute>
          }
        />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default Router;
