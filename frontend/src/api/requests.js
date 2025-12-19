import api from './client';

export const fetchOverview = async () => {
  const { data } = await api.get('/overview');
  return data;
};

export const fetchRequests = async (params) => {
  const { data } = await api.get('/requests', { params });
  return data;
};

export const createRequest = async (payload) => {
  const { data } = await api.post('/requests', payload);
  return data;
};

export const updateRequest = async (id, payload) => {
  const { data } = await api.put(`/requests/${id}`, payload);
  return data;
};

export const deleteRequest = async (id) => {
  const { data } = await api.delete(`/requests/${id}`);
  return data;
};
