import { mount, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueI18n from 'vue-i18n';
import PortraitSorting from '@/components/PortraitSorting.vue';

const columns = [
  {
    value: 'creationDate',
  },
  {
    value: 'client',
  },
  {
    value: 'project',
  },
];

const translatedColumns = [
  {
    id: 'creationDate',
    text: 'dataGridColumns.creationDate'
  },
  {
    id: 'client',
    text: 'dataGridColumns.client'
  },
  {
    id: 'project',
    text: 'dataGridColumns.project'
  },
];

describe('PortraitSorting.vue', () => {
  let wrapper;
  let vuetify;
  let i18n;

  const isVisible = true;

  beforeEach(() => {
    vuetify = new Vuetify();
    i18n = new VueI18n();

    document.body.setAttribute('data-app', true);

    wrapper = mount(PortraitSorting, {
      vuetify,
      i18n,
      propsData: {
        columns
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('exists', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders components', () => {
    expect(wrapper.findComponent({ref: 'column'}).exists()).toBe(true);
    expect(wrapper.findComponent({ref: 'order'}).exists()).toBe(true);
  });

  it('renders v-select items', () => {
    const items = wrapper.findComponent({ref: 'column'}).props('items');
    expect(items.length).toBe(3);
    expect(items).toStrictEqual(translatedColumns);
  });

  it('has ASC order selected by default', () => {
    expect(wrapper.findComponent({ref: 'order'}).props('value')).toBe(0);
  });

  it('emits sort on column change', async () => {
    await wrapper.findComponent({ref: 'column'}).vm.selectItem('Klient');

    expect(wrapper.emitted().sort).toBeTruthy();
  });

  it('emits sort on order change', async () => {
    await wrapper.findComponent({ref: 'order'}).vm.selectItem('Rosnąco');

    expect(wrapper.emitted().sort).toBeTruthy();
  });
});
