const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const getDashboardStats = async (token) => {
  const response = await fetch(`${API_BASE}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
};
