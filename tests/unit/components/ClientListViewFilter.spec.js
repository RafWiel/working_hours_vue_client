import { mount, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import ClientListViewFilter from '@/components/ClientListViewFilter.vue';

const $route = {
  query: {
    search: 'js',
    'start-date': '2023-01-01',
    'settlement-type': 1
  }
}

describe('ClientListViewFilter.vue', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();

    document.body.setAttribute('data-app', true);

    wrapper = mount(ClientListViewFilter, {
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

  it('emits filter on search change', async () => {
    await wrapper.findComponent({ref: 'search'}).get('input').setValue('test');

    expect(wrapper.emitted().filter).toBeTruthy();
  });
});
