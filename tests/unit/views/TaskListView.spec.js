import { mount, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import TaskListView from '@/views/TaskListView.vue';
import '@/misc/directives';
import moment from 'moment';
import tasksService from '@/services/tasks';

const $route = {
  meta: {
    isTaskListView: true,
  },
  query: {
    'settlement-type': 1
  }
}

const $store = {
  state: {
    userType: 0
  }
}

const $t = () => {}

const items = [
  {
    "id": 1,
    "creationDate": "2022-11-09T00:00:00.000Z",
    "settlementDate": "2022-12-25T00:00:00.000Z",
    "type": 1,
    "version": "18",
    "description": "Opis",
    "price": "100.00",
    "hours": null,
    "client": "JS",
    "project": "WebApi"
  },
  {
    "id": 2,
    "creationDate": "2022-11-08T00:00:00.000Z",
    "settlementDate": "2022-12-25T00:00:00.000Z",
    "type": 2,
    "version": "1.0",
    "description": "Opis",
    "price": null,
    "hours": 1.5,
    "client": null,
    "project": "System Manager"
  },
];

jest.mock('@/services/tasks');

describe('TaskListView', () => {
  let wrapper;
  let vuetify;

  tasksService.settle = jest.fn().mockResolvedValue({ status: 200 });
  tasksService.get = jest.fn().mockResolvedValue(items);

  const fetchMethod = jest.spyOn(TaskListView.methods, 'fetch');

  beforeEach(() => {
    vuetify = new Vuetify();

    document.body.setAttribute('data-app', true);

    wrapper = mount(TaskListView, {
      vuetify,
      mocks: {
        $route,
        $store,
        $t
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('exists', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders datagrid', () => {
    expect(wrapper.findComponent({ref: 'datagrid'}).exists()).toBe(true);
  });

  it('does not render portrait sorting in smAndUp mode', () => {
    vuetify.framework.breakpoint = {
      init: jest.fn(),
      framework: {},
      xs: false,
      smAndUp: true,
    };

    wrapper = mount(TaskListView, {
      vuetify,
      mocks: {
        $route,
        $store,
        $t
      }
    });

    expect(wrapper.findComponent({ref: 'portrait-sorting'}).exists()).toBe(false);
  });

  it('renders portrait sorting in xs mode', () => {
    vuetify.framework.breakpoint = {
      init: jest.fn(),
      framework: {},
      xs: true,
      smAndUp: false,
    };

    wrapper = mount(TaskListView, {
      vuetify,
      mocks: {
        $route,
        $store,
        $t
      }
    });

    expect(wrapper.findComponent({ref: 'portrait-sorting'}).exists()).toBe(true);
  });

  it('emits error message', () => {
    wrapper.vm.processError('test', 'test');

    expect(wrapper.emitted().showMessage).toBeTruthy();
  });

  it('settles', () => {
    const selectedItems = [
      {
        id: 1,
        isSelected: true,
      },
      {
        id: 2,
        isSelected: false,
      },
    ];

    wrapper.vm.$data.items = JSON.parse(JSON.stringify(selectedItems));
    wrapper.vm.settleTasks();

    expect(tasksService.settle).toHaveBeenCalled();
    expect(fetchMethod).toHaveBeenCalled();
  });
});
