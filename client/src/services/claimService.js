import API from './api';

export const claimService = {
  async submitClaim(claimData) {
    const response = await API.post('/claims', claimData);
    return response.data;
  },

  async getMyClaims() {
    const response = await API.get('/claims/my');
    return response.data;
  },

  async getReceivedClaims() {
    const response = await API.get('/claims/received');
    return response.data;
  },

  async getClaimById(id) {
    const response = await API.get(`/claims/${id}`);
    return response.data;
  },

  async updateClaimStatus(id, { status, reviewerNotes }) {
    const response = await API.patch(`/claims/${id}/status`, { status, reviewerNotes });
    return response.data;
  },

  async cancelClaim(id) {
    const response = await API.patch(`/claims/${id}/cancel`);
    return response.data;
  },
};

export default claimService;
