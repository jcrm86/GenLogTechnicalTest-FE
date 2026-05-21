import { api } from './api';

// Example service — replace or extend with your actual resource types and endpoints.

export interface ExampleItem {
  id: number;
  name: string;
}

export const exampleService = {
  getAll: () => api.get<ExampleItem[]>('/example'),

  getById: (id: number) => api.get<ExampleItem>(`/example/${id}`),

  create: (payload: Omit<ExampleItem, 'id'>) =>
    api.post<ExampleItem>('/example', payload),

  update: (id: number, payload: Partial<ExampleItem>) =>
    api.put<ExampleItem>(`/example/${id}`, payload),

  remove: (id: number) => api.delete<void>(`/example/${id}`),
};
