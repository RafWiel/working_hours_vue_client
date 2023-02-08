import axios from 'axios';
import store from '@/misc/store';

export default () => {
  const api = axios.create({
    baseURL: `${process.env.VUE_APP_ADDRESS}`,
    headers: { Authorization: `Bearer ${store.state.token}` },
  });

  // api.interceptors.request.use((request) => {
  //   console.log('interceptors.request');
  //   return request;
  // });

  // api.interceptors.response.use((response) => response, (error) => {
  //   // console.log('interceptors.response error: ', error);
  //   router.replace({ name: 'Login' });
  //   return error;
  // });

  return api;
};
