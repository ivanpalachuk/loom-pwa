// Tipos de ejemplo
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Photo {
  id: string;
  url: string;
  userId: string;
  createdAt: string;
}

// Simulación de API - Reemplazar con tus endpoints reales
const API_BASE_URL = '/api';

export const api = {
  // Usuarios
  getUser: async (id: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error('Error fetching user');
    return response.json();
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error updating user');
    return response.json();
  },

  // Fotos
  getPhotos: async (userId: string): Promise<Photo[]> => {
    const response = await fetch(`${API_BASE_URL}/photos?userId=${userId}`);
    if (!response.ok) throw new Error('Error fetching photos');
    return response.json();
  },

  uploadPhoto: async (imageData: string, userId: string): Promise<Photo> => {
    const response = await fetch(`${API_BASE_URL}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageData, userId }),
    });
    if (!response.ok) throw new Error('Error uploading photo');
    return response.json();
  },

  deletePhoto: async (photoId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/photos/${photoId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error deleting photo');
  },
};
