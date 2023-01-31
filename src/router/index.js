import Vue from 'vue';
import VueRouter from 'vue-router';
import TestView from '../views/TestView.vue';
import TaskAddView from '../views/TaskAddView.vue';
import TaskListView from '../views/TaskListView.vue';
import taskType from '../enums/taskType';
import ClientListView from '../views/ClientListView.vue';
import TaskViewEditView from '../views/TaskViewEditView.vue';
import UserRegisterView from '../views/UserRegisterView.vue';

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
    path: '/ad/task_add',
    name: 'adTaskAdd',
    component: TaskAddView,
    meta: {
      title: 'Nowe zadanie Aldridge',
      titleLong: 'Nowe zadanie Aldridge',
      type: taskType.hoursBased,
    },
  },
  {
    path: '/ds/task_add',
    name: 'dsTaskAdd',
    component: TaskAddView,
    meta: {
      title: 'Nowe zadanie DataSoft',
      titleLong: 'Nowe zadanie DataSoft',
      type: taskType.priceBased,
    },
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TaskListView,
    meta: {
      title: 'Zadania',
      titleLong: 'Zadania',
      isTaskListView: true,
    },
  },
  {
    path: '/clients',
    name: 'clients',
    component: ClientListView,
    meta: {
      title: 'Klienci',
      titleLong: 'Klienci',
    },
  },
  {
    path: '/tasks/:id',
    name: 'task',
    component: TaskViewEditView,
    props: true,
    meta: {
      title: 'Zadanie',
      titleLong: 'Zadanie',
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
      title: 'Rejestracja',
      titleLong: 'Rejestracja',
    },
  },
];

const router = new VueRouter({
  // mode: 'history',
  routes,
});

export default router;
