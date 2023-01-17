import { mount, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import TaskListViewFilter from '@/components/TaskListViewFilter.vue';

const $route = {
  query: {
    search: 'js',
    'start-date': '2023-01-01'
  }
}

describe('TaskListViewFilter.vue', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();

    document.body.setAttribute('data-app', true);

    wrapper = mount(TaskListViewFilter, {
      vuetify,
      mocks: { $route }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('exists', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders components', () => {
    expect(wrapper.findComponent({ref: 'search'}).exists()).toBe(true);
  });

  it('renders parameter from query', () => {
    expect(wrapper.findComponent({ref: 'search'}).props('value')).toBe($route.query.search);
  });

  it('time period control is disabled if date set', () => {
    expect(wrapper.findComponent({ref: 'timePeriod'}).props('disabled')).toBe(true);
  });

  it('emits filter on search change', async () => {
    await wrapper.findComponent({ref: 'search'}).get('input').setValue('test');

    expect(wrapper.emitted().filter).toBeTruthy();
  });
});
