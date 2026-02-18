import api from '../../services/api';

// Recipe APIs
export const recipeAPI = {
  create: (recipeData) => api.post('/api/recipes', recipeData),
  getById: (id) => api.get(`/api/recipes/${id}`),
  getAll: () => api.get('/api/recipes'),
  getByUser: (userId) => api.get(`/api/recipes/user/${userId}`),
  search: (params) => api.get('/api/recipes/search', { params }),
  update: (id, recipeData) => api.put(`/api/recipes/${id}`, recipeData),
  delete: (id) => api.delete(`/api/recipes/${id}`)
};
