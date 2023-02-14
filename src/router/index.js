import Vue from 'vue';
import VueRouter from 'vue-router';
import i18n from '@/plugins/i18n';
import TestView from '../views/TestView.vue';
import TaskAddView from '../views/TaskAddView.vue';
import TaskListView from '../views/TaskListView.vue';
import taskType from '../enums/taskType';
import ClientListView from '../views/ClientListView.vue';
import TaskViewEditView from '../views/TaskViewEditView.vue';
import UserRegisterView from '../views/UserRegisterView.vue';
import LoginView from '../views/LoginView.vue';
import authorization from '../middleware/authorization';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'main',
    redirect: {
      name: 'tasks',
    },
  },
  {
    path: '*',
    redirect: '/',
  },
  {
    path: '/tasks/ad',
    name: 'adTaskAdd',
    component: TaskAddView,
    meta: {
      title: i18n.t('taskAddView.titleAd'),
      titleLong: i18n.t('taskAddView.titleAd'),
      type: taskType.hoursBased,
      middleware: [authorization.validUser, authorization.administrator],
    },
  },
  {
    path: '/tasks/ds',
    name: 'dsTaskAdd',
    component: TaskAddView,
    meta: {
      title: i18n.t('taskAddView.titleDs'),
      titleLong: i18n.t('taskAddView.titleDs'),
      type: taskType.priceBased,
      middleware: [authorization.validUser, authorization.administrator],
    },
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TaskListView,
    meta: {
      title: i18n.t('taskListView.metaTitle'),
      titleLong: i18n.t('taskListView.metaTitle'),
      isTaskListView: true,
      middleware: [authorization.validUser],
    },
  },
  {
    path: '/clients',
    name: 'clients',
    component: ClientListView,
    meta: {
      title: i18n.t('clientListView.title'),
      titleLong: i18n.t('clientListView.title'),
      middleware: [authorization.validUser, authorization.datasoft],
    },
  },
  {
    path: '/tasks/:id',
    name: 'task',
    component: TaskViewEditView,
    props: true,
    meta: {
      title: i18n.t('taskViewEditView.title'),
      titleLong: i18n.t('taskViewEditView.title'),
      middleware: [authorization.validUser],
    },
  },
  {
    path: '/test',
    name: 'test',
    component: TestView,
    meta: {
      title: 'Test',
      titleLong: 'Test',
    },
  },
  {
    path: '/register',
    name: 'userRegister',
    component: UserRegisterView,
    meta: {
      isMenuHidden: true,
      title: i18n.t('userRegisterView.title'),
      titleLong: i18n.t('userRegisterView.title'),
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      isMenuHidden: true,
      title: i18n.t('loginView.title'),
      titleLong: i18n.t('loginView.title'),
    },
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
  base: '/settlement/',
});

function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index];

  if (!subsequentMiddleware) return context.next;

  return (...parameters) => {
    context.next(...parameters);
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];

    const context = {
      from,
      next,
      router,
      to,
    };

    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({ ...context, next: nextMiddleware });
  }

  return next();
});

export default router;
