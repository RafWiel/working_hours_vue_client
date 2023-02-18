import api from '@/services/api';

export default {
  getNamesDistinct(request) {
    return api().get('projects/names/distinct', { params: request });
  },
};
