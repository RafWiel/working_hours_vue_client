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

    // let app = document.createElement("div");
    // app.setAttribute("data-app", true);
    // document.body.append(app);

    document.body.setAttribute('data-app', true);

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
    const isVisible = false;

    wrapper = mount(MessageDialog, {
      vuetify,
      propsData: {
        isVisible: isVisible,
      },
    });

    expect(wrapper.find('#okButton').exists()).toBe(isVisible);
  });

  it('renders props data', () => {
    const titleObj = wrapper.find('.v-card__title > h5');
    expect(titleObj.text()).toBe(title);

    const messageObj = wrapper.find('.v-card__text > span');
    expect(messageObj.text()).toBe(message);
  });

  it('triggers closeRequest on click', async () => {
    await wrapper.find('#okButton').trigger('click');

    expect(wrapper.vm.closeRequest).toHaveBeenCalled();
  });
});
