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
