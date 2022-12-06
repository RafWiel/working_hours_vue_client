import api from '@/services/api';

export default {
  getNamesDistinct(data) {
    return api().get('/ds/clients/names/distinct', { params: data });
  },
};
