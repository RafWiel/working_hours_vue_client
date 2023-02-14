import i18n from '@/plugins/i18n';

const none = 0;
const all = 1;
const settled = 2;
const unsettled = 3;

export default {
  none,
  all,
  settled,
  unsettled,
  getText(id) {
    const item = this.items.find((u) => u.id === id);
    return item ? item.text : '';
  },
  getItems() {
    return [
      { id: all, text: i18n.t('enums.settlementType.all') },
      { id: settled, text: i18n.t('enums.settlementType.settled') },
      { id: unsettled, text: i18n.t('enums.settlementType.unsettled') },
    ];
  },
};
