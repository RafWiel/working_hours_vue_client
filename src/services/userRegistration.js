import api from '@/services/api';

export default {
  create(data) {
    return api().post('users', data);
  },
  isUniqueUsername(data) {
    return api().post('users/unique-username', data);
  },
};
