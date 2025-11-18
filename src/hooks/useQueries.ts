import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { User } from '../services/api';

// Query Keys
export const queryKeys = {
  user: (id: string) => ['user', id] as const,
  photos: (userId: string) => ['photos', userId] as const,
};

// Hooks para Usuario
export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => api.getUser(id),
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      api.updateUser(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user(data.id) });
    },
  });
};

// Hooks para Fotos
export const usePhotos = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.photos(userId),
    queryFn: () => api.getPhotos(userId),
    enabled: !!userId,
  });
};

export const useUploadPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageData, userId }: { imageData: string; userId: string }) =>
      api.uploadPhoto(imageData, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.photos(variables.userId) });
    },
  });
};

export const useDeletePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoId: string) => api.deletePhoto(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
};
