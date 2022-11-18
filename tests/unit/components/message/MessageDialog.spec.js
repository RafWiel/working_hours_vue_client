import { mount, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import MessageDialog from '@/components/message/MessageDialog.vue';

describe('MessageDialog.vue', () => {
  let wrapper;
  let vuetify;

  const title = 'test title';
  const message = 'test message';
  const isVisible = true;

  beforeEach(() => {
    vuetify = new Vuetify();

    //shallowMount chyba nie laduje Vuetify, test klikniecia przycisku nie dziala
    wrapper = mount(MessageDialog, {
      vuetify,
      propsData: {
        title,
        message,
        isVisible,
        closeRequest: jest.fn()
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('is not visible on start', () => {
    wrapper = mount(MessageDialog, {
      vuetify,
      propsData: {
        isVisible: false,
      },
    });

    expect(wrapper.find('#okButton').exists()).toBe(false);
  });

  it('renders props data', () => {
    expect(wrapper.text()).toMatch(title);
    expect(wrapper.text()).toMatch(message);
  });

  it('triggers closeRequest on click', async () => {
    await wrapper.find('#okButton').trigger('click');

    expect(wrapper.vm.closeRequest).toHaveBeenCalled();
  });
});
