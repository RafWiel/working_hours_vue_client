import api from '@/services/api';

export default {
  create(request) {
    return api().post('tasks', request);
  },
  update(request) {
    return api().put('tasks', request);
  },
  getLast(request) {
    return api().get('tasks/last', { params: request });
  },
  get(request) {
    return api().get('tasks', { params: request });
  },
  settle(request) {
    return api().post('tasks/settle', request);
  },
  invoice(request) {
    return api().post('tasks/invoice', request);
  },
  getOne(id) {
    return api().get(`tasks/${id}`);
  },
  delete(id) {
    return api().delete(`tasks/${id}`);
  },
};
