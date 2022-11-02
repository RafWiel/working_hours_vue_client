import Vue from 'vue';
import VueRouter from 'vue-router';
import TestView from '../views/TestView.vue';
import TaskAddView from '../views/TaskAddView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'main',
    redirect: {
      name: 'task_add',
    },
  },
  {
    path: '*',
    redirect: '/',
  },
  {
    path: '/task_add',
    name: 'task_add',
    component: TaskAddView,
    meta: {
      title: 'Nowe zadanie',
      titleLong: 'Nowe zadanie',
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
];

const router = new VueRouter({
  routes,
});

export default router;
