import api from './api'

export const listService = {
  getAll: () => api.get('/lists').then((r) => r.data),
  getOne: (id) => api.get(`/lists/${id}`).then((r) => r.data),
  create: (data) => api.post('/lists', data).then((r) => r.data),
  update: (id, data) => api.put(`/lists/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/lists/${id}`),
  duplicate: (id) => api.post(`/lists/${id}/duplicate`).then((r) => r.data),
}
