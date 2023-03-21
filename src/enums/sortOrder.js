import i18n from '@/plugins/i18n';

const ascending = 0;
const descending = 1;

export default {
  ascending,
  descending,
  getText(id) {
    const item = this.items.find((u) => u.id === parseInt(id, 10));
    return item ? item.text : '';
  },
  getItems() {
    return [
      { id: ascending, text: i18n.t('enums.sorting.ascending') },
      { id: descending, text: i18n.t('enums.sorting.descending') },
    ];
  },
  isValid(value) {
    return value >= ascending && value <= descending;
  },
};
