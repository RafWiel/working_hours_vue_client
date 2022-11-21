import { mount, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import TaskAddView from '@/views/aldridge/TaskAddView.vue';
import '@/misc/directives';

describe('TaskAddView.vue', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();

    document.body.setAttribute('data-app', true);

    wrapper = mount(TaskAddView, {
      vuetify,
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('exists', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
