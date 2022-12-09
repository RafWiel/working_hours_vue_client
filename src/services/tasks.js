import api from '@/services/api';

export default {
  create(request) {
    return api().post('/tasks', request);
  },
  getNewest(data) {
    return api().get('/tasks/newest', { params: data });
  },
};
