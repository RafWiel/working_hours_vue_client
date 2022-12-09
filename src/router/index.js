import Vue from 'vue';
import VueRouter from 'vue-router';
import TestView from '../views/TestView.vue';
import TaskAddView from '../views/TaskAddView.vue';
import taskType from '../enums/taskType';

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
    component: TaskAddView,
    meta: {
      title: 'Nowe zadanie Aldridge',
      titleLong: 'Nowe zadanie Aldridge',
      type: taskType.hoursBased,
    },
  },
  {
    path: '/ds/task_add',
    name: 'ds_task_add',
    component: TaskAddView,
    meta: {
      title: 'Nowe zadanie DataSoft',
      titleLong: 'Nowe zadanie DataSoft',
      type: taskType.priceBased,
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
