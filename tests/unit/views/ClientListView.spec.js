import { mount, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import ClientListView from '@/views/ClientListView.vue';
import '@/misc/directives';
import moment from 'moment';
import clientsService from '@/services/clients';
import VueI18n from 'vue-i18n';

const $route = {
  meta: {
    isTaskListView: true,
  },
  query: {
    'settlement-type': 1
  }
}

const items = [
  {
    "client": "Techsam",
    "amount": "1.00"
  },
  {
      "client": "Technobeton",
      "amount": "1.00"
  },
  {
      "client": "JS",
      "amount": "1447.00"
  }
];

jest.mock('@/services/clients');

describe('ClientListView', () => {
  let wrapper;
  let vuetify;
  let i18n;

  clientsService.get = jest.fn().mockResolvedValue(items);

  const fetchMethod = jest.spyOn(ClientListView.methods, 'fetch');

  beforeEach(() => {
    vuetify = new Vuetify();
    i18n = new VueI18n();

    document.body.setAttribute('data-app', true);

    wrapper = mount(ClientListView, {
      vuetify,
      i18n,
      mocks: {
        $route
      }
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

    wrapper = mount(ClientListView, {
      vuetify,
      i18n,
      mocks: {
        $route
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

    wrapper = mount(ClientListView, {
      vuetify,
      i18n,
      mocks: {
        $route
      }
    });

    expect(wrapper.findComponent({ref: 'portrait-sorting'}).exists()).toBe(true);
  });

  it('emits error message', () => {
    wrapper.vm.processError('test', 'test');

    expect(wrapper.emitted().showMessage).toBeTruthy();
  });
});
