import { mount, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import QuestionDialog from '@/components/message/QuestionDialog.vue';

//document.body.setAttribute('data-app', true);

describe('QuestionDialog.vue', () => {
  let wrapper;
  let vuetify;

  const title = 'test title';
  const message = 'test message';
  const isVisible = true;

  beforeEach(() => {
    vuetify = new Vuetify();

    document.body.setAttribute('data-app', true);

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
    const isVisible = false;

    wrapper = mount(QuestionDialog, {
      vuetify,
      propsData: {
        isVisible: isVisible,
      },
    });

    expect(wrapper.find('#yesButton').exists()).toBe(isVisible);
  });

  it('renders props data', () => {
    const titleObj = wrapper.find('.v-card__title > h5');
    expect(titleObj.text()).toBe(title);

    const messageObj = wrapper.find('.v-card__text > span');
    expect(messageObj.text()).toBe(message);
  });

  it('triggers closeRequest on No click', async () => {
    await wrapper.find('#noButton').trigger('click');

    expect(wrapper.vm.closeRequest).toHaveBeenCalled();
  });

  it('emits apply on Yes click', async () => {
    await wrapper.find('#yesButton').trigger('click');

    expect(wrapper.emitted().apply).toBeTruthy();
    expect(wrapper.vm.closeRequest).toHaveBeenCalled();
  });
});
