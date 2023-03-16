import store from '../plugins/store';
import userType from '../enums/userType';

export default {
  validUser({ next, router }) {
    if (!localStorage.getItem('userInfo')) {
      router.replace({ name: 'login' });
      return next();
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // require login each day
    const loginTimestamp = new Date(parseInt(userInfo.timestamp, 10));
    if ((!loginTimestamp || loginTimestamp.getDate() !== new Date().getDate())) {
      router.replace({ name: 'login' });
      return next();
    }

    // set store user info
    store.dispatch('setUser', userInfo);

    return next();
  },
  administrator({ next, router }) {
    if (store.state.userType !== userType.administrator) {
      return router.replace({ name: 'main' });
    }

    return next();
  },
  dsf({ next, router }) {
    if (store.state.userType !== userType.administrator
      && store.state.userType !== userType.dsf) {
      return router.replace({ name: 'main' });
    }

    return next();
  },
};
