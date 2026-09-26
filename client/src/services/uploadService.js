import API from './api';

export const uploadService = {
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await API.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // { success: true, url: string }
  },
};

export default uploadService;
