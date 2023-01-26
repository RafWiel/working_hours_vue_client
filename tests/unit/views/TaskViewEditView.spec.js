import { mount, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import TaskViewEditView from '@/views/TaskViewEditView.vue';
import '@/misc/directives';
import moment from 'moment';

const item = {
  creationDate: moment(new Date()).format('YYYY-MM-DD'),
  type: 1,
  project: 'project',
  client: 'client',
  version: 'version',
  price: 1,
  description: 'description'
};

describe('TaskViewEditView', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();

    document.body.setAttribute('data-app', true);

    wrapper = mount(TaskViewEditView, {
      vuetify
    });

    wrapper.vm.$data.item = JSON.parse(JSON.stringify(item));
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('exists', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders date', () => {
    expect(wrapper.findComponent({ref: 'creationDate'}).exists()).toBe(true);
  });

  it('renders price', () => {

    expect(wrapper.findComponent({ref: 'price'}).exists()).toBe(true);
  });

  it('doesnt render hours', () => {
    expect(wrapper.findComponent({ref: 'hours'}).exists()).toBe(false);
  });

  it('validates', async () => {
    const item = {
      creationDate: moment(new Date()).format('YYYY-MM-DD'),
      type: 1,
      project: 'project',
      client: 'client',
      version: 'version',
      price: 1,
      description: 'description'
    };

    //accomplishes
    wrapper.vm.$data.item = JSON.parse(JSON.stringify(item));
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$refs.form.validate()).toBe(true);

    //fails on date
    wrapper.vm.$data.item = JSON.parse(JSON.stringify(item));
    wrapper.vm.$data.item.creationDate = null;
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$refs.form.validate()).toBe(false);

    //fails on client
    wrapper.vm.$data.item = JSON.parse(JSON.stringify(item));
    wrapper.vm.$data.item.client = null;
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$refs.form.validate()).toBe(false);

    //fails on project
    wrapper.vm.$data.item = JSON.parse(JSON.stringify(item));
    wrapper.vm.$data.item.project = null;
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$refs.form.validate()).toBe(false);

    //fails on version
    wrapper.vm.$data.item = JSON.parse(JSON.stringify(item));
    wrapper.vm.$data.item.version = null;
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$refs.form.validate()).toBe(false);

    //fails on price
    wrapper.vm.$data.item = JSON.parse(JSON.stringify(item));
    wrapper.vm.$data.item.price = null;
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$refs.form.validate()).toBe(false);

    //fails on description
    wrapper.vm.$data.item = JSON.parse(JSON.stringify(item));
    wrapper.vm.$data.item.description = null;
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$refs.form.validate()).toBe(false);
  });

  it('emits error message', () => {
    wrapper.vm.processError('test');

    expect(wrapper.emitted().showMessage).toBeTruthy();
  });
});
