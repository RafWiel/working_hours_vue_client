import i18n from '@/plugins/i18n';

const administrator = 0;
const datasoft = 1;
const aldridge = 2;

export default {
  administrator,
  datasoft,
  aldridge,
  items: [
    { id: administrator, text: 'Administrator' },
    { id: aldridge, text: 'Aldridge' },
    { id: datasoft, text: 'DataSoft' },
  ],
  getText(id) {
    const item = this.items.find((u) => u.id === id);
    return item ? item.text : '';
  },
  getItems() {
    return [
      { id: administrator, text: i18n.t('enums.userType.administrator') },
      { id: aldridge, text: i18n.t('enums.userType.aldridge') },
      { id: datasoft, text: i18n.t('enums.userType.datasoft') },
    ];
  },
};
