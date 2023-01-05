import api from '@/services/api';

export default {
  get(data) {
    return api().get('/clients', { params: data });
  },
  getNamesDistinct(data) {
    return api().get('/clients/names/distinct', { params: data });
  },
};
