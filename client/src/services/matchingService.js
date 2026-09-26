import API from './api';

export const matchingService = {
  async getMatchesForLostItem(lostItemId) {
    const response = await API.get(`/matches/lost/${lostItemId}`);
    return response.data;
  },

  async getMatchesForFoundItem(foundItemId) {
    const response = await API.get(`/matches/found/${foundItemId}`);
    return response.data;
  },
};

export default matchingService;
