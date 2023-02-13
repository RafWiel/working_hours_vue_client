import i18n from '@/misc/i18n';

const all = 0;
const currentWeek = 1;
const currentMonth = 2;
const previousMonth = 3;

export default {
  all,
  currentWeek,
  currentMonth,
  previousMonth,
  getText(id) {
    const item = this.items.find((u) => u.id === id);
    return item ? item.text : '';
  },
  getItems() {
    return [
      { id: all, text: i18n.t('enums.timePeriod.all') },
      { id: currentWeek, text: i18n.t('enums.timePeriod.currentWeek') },
      { id: currentMonth, text: i18n.t('enums.timePeriod.currentMonth') },
      { id: previousMonth, text: i18n.t('enums.timePeriod.previousMonth') },
    ];
  },
};
