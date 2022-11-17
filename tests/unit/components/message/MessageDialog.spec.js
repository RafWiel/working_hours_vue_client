import { shallowMount } from '@vue/test-utils';
import MessageDialog from '@/components/message/MessageDialog.vue';

describe('MessageDialog.vue', () => {
  it('renders props data', () => {
    const title = 'test title';
    const message = 'test message';

    const wrapper = shallowMount(MessageDialog, {
      propsData: {
        title,
        message
      },
    });

    expect(wrapper.text()).toMatch(title);
    expect(wrapper.text()).toMatch(message);
  });
});
