import api from '@/services/api';

export default {
  create(request) {
    return api().post('users', request);
  },
  isUniqueUsername(request) {
    return api().post('users/unique-username', request);
  },
  login(request) {
    return api().post('user', request);
  },
  setLocale(request) {
    return api().put('user', request);
  },
};
