import { mount, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import DatePickerDialog from '@/components/DatePickerDialog.vue';

describe('DatePickerDialog.vue', () => {
  let wrapper;
  let vuetify;

  const isVisible = true;

  beforeEach(() => {
    vuetify = new Vuetify();

    document.body.setAttribute('data-app', true);

    //shallowMount chyba nie laduje Vuetify, test klikniecia przycisku nie dziala
    wrapper = mount(DatePickerDialog, {
      vuetify,
      propsData: {
        isVisible,
        hideRequest: jest.fn()
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('is not visible on start', () => {
    const isVisible = false;

    wrapper = mount(DatePickerDialog, {
      vuetify,
      propsData: {
        isVisible: isVisible,
      },
    });

    expect(wrapper.findComponent({ref: 'okButton'}).exists()).toBe(isVisible);
  });

  it('emits apply on OK click', async () => {
    await wrapper.findComponent({ref: 'okButton'}).trigger('click');

    expect(wrapper.emitted().apply).toBeTruthy();
    expect(wrapper.vm.hideRequest).toHaveBeenCalled();
  });
});
