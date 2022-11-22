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

    petle trzeba inaczej zrobic, tylko ostatni element jest testowany
    teraz dziala, a jak zamienic kolejnosc to bedzie zle
    //fails on date
    const dates = [ null, 'aa' ];
    wrapper.vm.$data.item = JSON.parse(JSON.stringify(item));

    dates.forEach(async (item) => {
      wrapper.vm.$data.item.date = item;
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.$refs.form.validate()).toBe(false);
    });

    dokoncz


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
    projects.forEach((item) => {
      item2.project = item;
      expect(wrapper.vm.isDuplicate(item1, item2)).toBe(false);
    });

    //different version
    item2 = JSON.parse(JSON.stringify(item1));
    const versions = [ 'test', '', null, undefined ];

    versions.forEach((item) => {
      item2.version = item;
      expect(wrapper.vm.isDuplicate(item1, item2)).toBe(false);
    });

    //different hours count
    item2 = JSON.parse(JSON.stringify(item1));
    const hoursCounts = [ 0, -1, '0', '', null, undefined ];

    hoursCounts.forEach((item) => {
      item2.hoursCount = item;
      expect(wrapper.vm.isDuplicate(item1, item2)).toBe(false);
    });
  });

  it('emits error message', () => {
    wrapper.vm.processError('test');

    expect(wrapper.emitted().showMessage).toBeTruthy();
  });
});
