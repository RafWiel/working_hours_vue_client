import api from '@/services/api';

export default {
  create(request) {
    return api().post('/ds/tasks', request);
  },
  getProjectsDistinct(data) {
    return api().get('/ds/tasks/projects/distinct', { params: data });
  },
  getNewest() {
    return api().get('/ds/tasks/newest');
  },
};
