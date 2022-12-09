import api from '@/services/api';

export default {
  getNamesDistinct(data) {
    return api().get('/projects/names/distinct', { params: data });
  },
};
