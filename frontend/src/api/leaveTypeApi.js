const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const getLeaveTypes = async (token) => {
  const response = await fetch(`${API_BASE}/leave-types`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
};

export const getLeaveTypeById = async (id, token) => {
  const response = await fetch(`${API_BASE}/leave-types/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
};

export const createLeaveType = async (data, token) => {
  const response = await fetch(`${API_BASE}/leave-types`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updateLeaveType = async (id, data, token) => {
  const response = await fetch(`${API_BASE}/leave-types/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteLeaveType = async (id, token) => {
  const response = await fetch(`${API_BASE}/leave-types/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
};
