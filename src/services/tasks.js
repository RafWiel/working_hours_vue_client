import api from '@/services/api';

export default {
  create(request) {
    return api().post('/tasks', request);
  },
  update(request) {
    return api().put('/tasks', request);
  },
  getLast(data) {
    return api().get('/tasks/last', { params: data });
  },
  get(data) {
    return api().get('/tasks', { params: data });
  },
  settle(request) {
    return api().post('/tasks/settle', request);
  },
  getOne(id) {
    return api().get(`tasks/${id}`);
  },
};
