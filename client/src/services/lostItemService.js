import API from './api';

export const lostItemService = {
  async getLostItems(params = {}) {
    const response = await API.get('/lost-items', { params });
    return response.data;
  },

  async getLostItemById(id) {
    const response = await API.get(`/lost-items/${id}`);
    return response.data;
  },

  async getMyLostItems() {
    const response = await API.get('/lost-items/my');
    return response.data;
  },

  async createLostItem(itemData) {
    const response = await API.post('/lost-items', itemData);
    return response.data;
  },

  async updateLostItem(id, itemData) {
    const response = await API.put(`/lost-items/${id}`, itemData);
    return response.data;
  },

  async deleteLostItem(id) {
    const response = await API.delete(`/lost-items/${id}`);
    return response.data;
  },

  async markRecovered(id) {
    const response = await API.patch(`/lost-items/${id}/recovered`);
    return response.data;
  },
};

export default lostItemService;
