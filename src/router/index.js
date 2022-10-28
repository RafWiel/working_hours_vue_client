import Vue from 'vue';
import VueRouter from 'vue-router';
import TaskAddView from '../views/TaskAddView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: TaskAddView,
    meta: {
      title: 'Nowe zadanie',
      titleLong: 'Nowe zadanie',
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
