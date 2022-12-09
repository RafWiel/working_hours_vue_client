import api from '@/services/api';

export default {
  getNamesDistinct(data) {
    return api().get('/clients/names/distinct', { params: data });
  },
};
