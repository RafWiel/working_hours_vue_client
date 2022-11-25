import { mount, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import TaskAddView from '@/views/aldridge/TaskAddView.vue';
import '@/misc/directives';
import moment from 'moment';

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

  it('validates', async () => {
    const item = {
      date: moment(new Date()).format('YYYY-MM-DD'),
      project: 'project',
      version: 'version',
      hoursCount: 1,
    };

    //accomplishes
    wrapper.vm.$data.item = JSON.parse(JSON.stringify(item));
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$refs.form.validate()).toBe(true);

    //fails on date
    wrapper.vm.$data.item = JSON.parse(JSON.stringify(item));
    wrapper.vm.$data.item.date = null;
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

    //fails on hours count
    wrapper.vm.$data.item = JSON.parse(JSON.stringify(item));
    wrapper.vm.$data.item.hoursCount = null;
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$refs.form.validate()).toBe(false);
  });

  it('verifies data duplicate', () => {
    const item1 = {
      date: moment(new Date()).format('YYYY-MM-DD'),
      project: 'project',
      version: 'version',
      hoursCount: 1,
    };

    //equal
    let item2 = JSON.parse(JSON.stringify(item1));
    expect(wrapper.vm.isDuplicate(item1, item2)).toBe(true);

    //different project
    const projects = [ 'test', '', null, undefined ];
    projects.forEach((project) => {
      item2.project = project;
      expect(wrapper.vm.isDuplicate(item1, item2)).toBe(false);
    });

    //different version
    item2 = JSON.parse(JSON.stringify(item1));
    const versions = [ 'test', '', null, undefined ];

    versions.forEach((version) => {
      item2.version = version;
      expect(wrapper.vm.isDuplicate(item1, item2)).toBe(false);
    });

    //different hours count
    item2 = JSON.parse(JSON.stringify(item1));
    const hoursCounts = [ 0, -1, '0', '', null, undefined ];

    hoursCounts.forEach((hoursCount) => {
      item2.hoursCount = hoursCount;
      expect(wrapper.vm.isDuplicate(item1, item2)).toBe(false);
    });
  });

  it('emits error message', () => {
    wrapper.vm.processError('test');

    expect(wrapper.emitted().showMessage).toBeTruthy();
  });
});
