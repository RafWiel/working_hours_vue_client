import i18n from '@/plugins/i18n';

const administrator = 0;
const dsf = 1;
const ald = 2;

export default {
  administrator,
  dsf,
  ald,
  items: [
    { id: administrator, text: 'Administrator' },
    { id: ald, text: 'Ald' },
    { id: dsf, text: 'Dsf' },
  ],
  getText(id) {
    const item = this.items.find((u) => u.id === id);
    return item ? item.text : '';
  },
  getItems() {
    return [
      { id: administrator, text: i18n.t('enums.userType.administrator') },
      { id: ald, text: i18n.t('enums.userType.ald') },
      { id: dsf, text: i18n.t('enums.userType.dsf') },
    ];
  },
};
