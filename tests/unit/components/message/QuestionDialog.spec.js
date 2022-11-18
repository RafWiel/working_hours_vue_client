import { mount, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import QuestionDialog from '@/components/message/QuestionDialog.vue';

describe('QuestionDialog.vue', () => {
  let wrapper;
  let vuetify;

  const title = 'test title';
  const message = 'test message';
  const isVisible = true;

  beforeEach(() => {
    vuetify = new Vuetify();

    //shallowMount chyba nie laduje Vuetify, test klikniecia przycisku nie dziala
    wrapper = mount(QuestionDialog, {
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
    wrapper = mount(QuestionDialog, {
      vuetify,
      propsData: {
        isVisible: false,
      },
    });

    expect(wrapper.find('#yesButton').exists()).toBe(false);
  });

  it('renders props data', () => {
    expect(wrapper.text()).toMatch(title);
    expect(wrapper.text()).toMatch(message);
  });

  it('triggers closeRequest on No click', async () => {
    await wrapper.find('#noButton').trigger('click');

    expect(wrapper.vm.closeRequest).toHaveBeenCalled();
  });

  it('emits apply on Yes click', async () => {
    await wrapper.find('#yesButton').trigger('click');

    expect(wrapper.emitted().apply).toBeTruthy();
    expect(wrapper.vm.closeRequest).toHaveBeenCalled();
  })
});
