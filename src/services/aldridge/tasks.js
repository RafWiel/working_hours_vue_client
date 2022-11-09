import api from '@/services/api';

export default {
  create(request) {
    return api().post('/ad/tasks', request);
  },
};
