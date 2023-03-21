import i18n from '@/plugins/i18n';

const all = 0;
const priceBased = 1;
const hoursBased = 2;

export default {
  all,
  priceBased,
  hoursBased,
  getText(id) {
    const item = this.items.find((u) => u.id === id);
    return item ? item.text : '';
  },
  getItems() {
    return [
      { id: all, text: i18n.t('enums.taskType.all') },
      { id: priceBased, text: i18n.t('enums.taskType.priceBased') },
      { id: hoursBased, text: i18n.t('enums.taskType.hoursBased') },
    ];
  },
  isValid(value) {
    return value >= all && value <= hoursBased;
  },
};
