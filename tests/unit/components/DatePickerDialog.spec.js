import { mount, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueI18n from 'vue-i18n';
import DatePickerDialog from '@/components/DatePickerDialog.vue';

describe('DatePickerDialog.vue', () => {
  let wrapper;
  let vuetify;
  let i18n;

  const isVisible = true;

  beforeEach(() => {
    vuetify = new Vuetify();
    i18n = new VueI18n();

    document.body.setAttribute('data-app', true);

    //shallowMount chyba nie laduje Vuetify, test klikniecia przycisku nie dziala
    wrapper = mount(DatePickerDialog, {
      vuetify,
      i18n,
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
      i18n,
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
