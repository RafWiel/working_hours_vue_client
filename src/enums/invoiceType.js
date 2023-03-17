import i18n from '@/plugins/i18n';

const none = 0;
const all = 1;
const issued = 2;
const notIssued = 3;

export default {
  none,
  all,
  issued,
  notIssued,
  getText(id) {
    const item = this.items.find((u) => u.id === id);
    return item ? item.text : '';
  },
  getItems() {
    return [
      { id: all, text: i18n.t('enums.invoiceType.all') },
      { id: issued, text: i18n.t('enums.invoiceType.issued') },
      { id: notIssued, text: i18n.t('enums.invoiceType.notIssued') },
    ];
  },
};
