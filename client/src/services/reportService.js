import API from './api';

export const reportService = {
  async submitReport(reportData) {
    const response = await API.post('/reports', reportData);
    return response.data;
  },

  async getReports() {
    const response = await API.get('/reports');
    return response.data;
  },

  async updateReport(id, updateData) {
    const response = await API.patch(`/reports/${id}`, updateData);
    return response.data;
  },
};

export default reportService;
