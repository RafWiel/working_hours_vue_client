import api from '@/services/api';

export default {
  create(request) {
    return api().post('/ad/tasks', request);
  },
  getProjectsDistinct(data) {
    return api().get('/ad/tasks/projects/distinct', { params: data });
  },
  getNewest() {
    return api().get('/ad/tasks/newest');
  },
};
