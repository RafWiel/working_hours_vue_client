import { shallowMount } from '@vue/test-utils';
import QuestionDialog from '@/components/message/QuestionDialog.vue';

describe('QuestionDialog.vue', () => {
  it('renders props data', () => {
    const title = 'test title';
    const message = 'test message';

    const wrapper = shallowMount(QuestionDialog, {
      propsData: {
        title,
        message
      },
    });

    expect(wrapper.text()).toMatch(title);
    expect(wrapper.text()).toMatch(message);
  });
});
