import api from './api'

export const itemService = {
  add: (listId, data) => api.post(`/lists/${listId}/items`, data).then((r) => r.data),
  update: (listId, itemId, data) => api.put(`/lists/${listId}/items/${itemId}`, data).then((r) => r.data),
  delete: (listId, itemId) => api.delete(`/lists/${listId}/items/${itemId}`),
  toggle: (listId, itemId) => api.patch(`/lists/${listId}/items/${itemId}/toggle`).then((r) => r.data),
  clearChecked: (listId) => api.delete(`/lists/${listId}/items/checked`),
}
