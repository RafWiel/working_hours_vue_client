import Vue from 'vue';
import VueRouter from 'vue-router';
import TestView from '../views/TestView.vue';
import TaskAddViewAD from '../views/Aldridge/TaskAddView.vue';
import TaskAddViewDS from '../views/DataSoft/TaskAddView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'main',
    redirect: {
      name: 'ds_task_add',
    },
  },
  {
    path: '*',
    redirect: '/',
  },
  {
    path: '/ad/task_add',
    name: 'ad_task_add',
    component: TaskAddViewAD,
    meta: {
      title: 'Nowe zadanie Aldridge',
      titleLong: 'Nowe zadanie Aldridge',
    },
  },
  {
    path: '/ds/task_add',
    name: 'ds_task_add',
    component: TaskAddViewDS,
    meta: {
      title: 'Nowe zadanie DataSoft',
      titleLong: 'Nowe zadanie DataSoft',
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
