import API from './api';

export const searchService = {
  async search(params = {}) {
    const response = await API.get('/search', { params });
    return response.data;
  },
};

export default searchService;
