import { mount, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import TaskListView from '@/views/TaskListView.vue';
import '@/misc/directives';
import moment from 'moment';

const $route = {
  meta: {
    isTaskListView: true
  }
}

describe('TaskListView.vue', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();

    document.body.setAttribute('data-app', true);

    wrapper = mount(TaskListView, {
      vuetify,
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

  it('emits error message', () => {
    wrapper.vm.processError('test');

    expect(wrapper.emitted().showMessage).toBeTruthy();
  });
});
