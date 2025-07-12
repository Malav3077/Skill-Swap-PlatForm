const API_BASE_URL = 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const api = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }
    
    return response.json();
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }
    
    return response.json();
  },

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }
    
    return response.json();
  },

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }
    
    return response.json();
  }
};