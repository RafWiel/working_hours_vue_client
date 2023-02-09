import store from '../misc/store';
import userType from '../enums/userType';

export default {
  validUser({ next, router }) {
    if (!localStorage.getItem('userInfo')) {
      return router.replace({ name: 'login' });
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // require login each day
    const loginTimestamp = new Date(parseInt(userInfo.timestamp, 10));
    if ((!loginTimestamp || loginTimestamp.getDate() !== new Date().getDate())) {
      return router.replace({ name: 'login' });
    }

    // set store user info
    store.dispatch('setUserName', userInfo.userName);
    store.dispatch('setToken', userInfo.token);
    store.dispatch('setUserType', userInfo.userType);

    return next();
  },
  administrator({ next, router }) {
    if (store.state.userType !== userType.administrator) {
      return router.replace({ name: 'main' });
    }

    return next();
  },
  datasoft({ next, router }) {
    if (store.state.userType !== userType.administrator
      && store.state.userType !== userType.datasoft) {
      return router.replace({ name: 'main' });
    }

    return next();
  },
};
