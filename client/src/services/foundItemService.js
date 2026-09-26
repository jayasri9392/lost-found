import API from './api';

export const foundItemService = {
  async getFoundItems(params = {}) {
    const response = await API.get('/found-items', { params });
    return response.data;
  },

  async getFoundItemById(id) {
    const response = await API.get(`/found-items/${id}`);
    return response.data;
  },

  async getMyFoundItems() {
    const response = await API.get('/found-items/my');
    return response.data;
  },

  async createFoundItem(itemData) {
    const response = await API.post('/found-items', itemData);
    return response.data;
  },

  async updateFoundItem(id, itemData) {
    const response = await API.put(`/found-items/${id}`, itemData);
    return response.data;
  },

  async deleteFoundItem(id) {
    const response = await API.delete(`/found-items/${id}`);
    return response.data;
  },

  async markReturned(id) {
    const response = await API.patch(`/found-items/${id}/returned`);
    return response.data;
  },
};

export default foundItemService;
