import Vue from 'vue';
import VueRouter from 'vue-router';
import TestView from '../views/TestView.vue';
import TaskAddView from '../views/TaskAddView.vue';
import TaskListView from '../views/TaskListView.vue';
import taskType from '../enums/taskType';
import ClientListView from '../views/ClientListView.vue';
import TaskViewEditView from '../views/TaskViewEditView.vue';
import UserRegisterView from '../views/UserRegisterView.vue';
import LoginView from '../views/LoginView.vue';
import authorization from '../middleware/authorization';
import store from '../plugins/store';

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
    path: '/add-task/ad',
    name: 'adTaskAdd',
    component: TaskAddView,
    meta: {
      isBackButton: true,
      type: taskType.hoursBased,
      middleware: [authorization.validUser, authorization.administrator],
    },
  },
  {
    path: '/add-task/ds/',
    name: 'dsTaskAdd',
    component: TaskAddView,
    meta: {
      isBackButton: true,
      type: taskType.priceBased,
      middleware: [authorization.validUser, authorization.administrator],
    },
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TaskListView,
    meta: {
      isTaskListView: true,
      middleware: [authorization.validUser],
    },
  },
  {
    path: '/tasks/ad',
    name: 'tasksAd',
    component: TaskListView,
    meta: {
      isTaskListView: true,
      middleware: [authorization.validUser],
    },
  },
  {
    path: '/tasks/ds',
    name: 'tasksDs',
    component: TaskListView,
    meta: {
      isTaskListView: true,
      middleware: [authorization.validUser],
    },
  },
  {
    path: '/clients',
    name: 'clients',
    component: ClientListView,
    meta: {
      middleware: [authorization.validUser, authorization.dsf],
    },
  },
  {
    path: '/tasks/:id',
    name: 'task',
    component: TaskViewEditView,
    props: true,
    meta: {
      isBackButton: true,
      middleware: [authorization.validUser],
    },
  },
  {
    path: '/register',
    name: 'userRegister',
    component: UserRegisterView,
    meta: {
      isMenuHidden: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      isMenuHidden: true,
    },
  },
  {
    path: '/test',
    name: 'test',
    component: TestView,
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

    // save path in case of authorization
    store.dispatch('setRoutePath', to.fullPath);

    const nextMiddleware = nextFactory(context, middleware, 1);
    return middleware[0]({ ...context, next: nextMiddleware });
  }

  return next();
});

export default router;
