import api from '@/services/api';

export default {
  get(request) {
    return api().get('clients', { params: request });
  },
  getNamesDistinct(request) {
    return api().get('clients/names/distinct', { params: request });
  },
};
