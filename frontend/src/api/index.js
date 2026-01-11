import apiClient from './axios.config';

export const authAPI = {
    signup: (data) => apiClient.post('/auth/signup', data),
    login: (data) => apiClient.post('/auth/login', data),
    updatePassword: (data) => apiClient.put('/auth/password', data),
};

export const adminAPI = {
    getDashboard: () => apiClient.get('/admin/dashboard'),
    getStores: (params) => apiClient.get('/admin/stores', { params }),
    addStore: (data) => apiClient.post('/admin/stores', data),
    getUsers: (params) => apiClient.get('/admin/users', { params }),
    addUser: (data) => apiClient.post('/admin/users', data),
    getUserDetails: (id) => apiClient.get(`/admin/users/${id}`),
};

export const userAPI = {
    getStores: (params) => apiClient.get('/user/stores', { params }),
    submitRating: (data) => apiClient.post('/user/ratings', data),
    updateRating: (id, data) => apiClient.put(`/user/ratings/${id}`, data),
    getMyRatings: () => apiClient.get('/user/ratings/my'),
};

export const storeAPI = {
    getDashboard: () => apiClient.get('/store/dashboard'),
    getRatings: () => apiClient.get('/store/ratings'),
};
