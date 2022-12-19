import api from '@/services/api';

export default {
  create(request) {
    return api().post('/tasks', request);
  },
  getLast(data) {
    return api().get('/tasks/last', { params: data });
  },
  get(data) {
    return api().get('/tasks', { params: data });
  },
};
