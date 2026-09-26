import API from './api';

export const dashboardService = {
  async getSummary() {
    const response = await API.get('/dashboard/summary');
    return response.data;
  },
};

export default dashboardService;
