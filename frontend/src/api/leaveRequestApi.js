const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const applyLeave = async (data, token) => {
  const response = await fetch(`${API_BASE}/leaves`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const getMyLeaves = async (token) => {
  const response = await fetch(`${API_BASE}/leaves/my`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
};

export const getLeaveById = async (id, token) => {
  const response = await fetch(`${API_BASE}/leaves/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
};

export const cancelLeave = async (id, token) => {
  const response = await fetch(`${API_BASE}/leaves/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
};

export const getMyBalances = async (token) => {
  const response = await fetch(`${API_BASE}/leaves/balances`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
};

export const getAllLeaves = async (status, token) => {
  let url = `${API_BASE}/leaves`;
  if (status) {
    url += `?status=${encodeURIComponent(status)}`;
  }
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
};

export const updateLeaveStatus = async (id, data, token) => {
  const response = await fetch(`${API_BASE}/leaves/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return response.json();
};
