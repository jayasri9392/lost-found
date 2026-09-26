import API from './api';

export const adminService = {
  async getStats() {
    const response = await API.get('/admin/stats');
    return response.data;
  },

  async getUsers() {
    const response = await API.get('/admin/users');
    return response.data;
  },

  async updateUserRole(id, role) {
    const response = await API.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  async deleteUser(id) {
    const response = await API.delete(`/admin/users/${id}`);
    return response.data;
  },

  async getLostItems() {
    const response = await API.get('/admin/lost-items');
    return response.data;
  },

  async deleteLostItem(id) {
    const response = await API.delete(`/admin/lost-items/${id}`);
    return response.data;
  },

  async getFoundItems() {
    const response = await API.get('/admin/found-items');
    return response.data;
  },

  async deleteFoundItem(id) {
    const response = await API.delete(`/admin/found-items/${id}`);
    return response.data;
  },

  async getClaims() {
    const response = await API.get('/admin/claims');
    return response.data;
  },

  async getReports() {
    const response = await API.get('/admin/reports');
    return response.data;
  },

  async updateReport(id, updateData) {
    const response = await API.patch(`/admin/reports/${id}`, updateData);
    return response.data;
  },
};

export default adminService;
