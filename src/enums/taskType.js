const all = 0;
const priceBased = 1;
const hoursBased = 2;

module.exports = {
  all,
  priceBased,
  hoursBased,
  items: [
    { id: all, text: 'Wszystkie' },
    { id: priceBased, text: 'DataSoft' },
    { id: hoursBased, text: 'Aldridge' },
  ],
  getText(id) {
    const item = this.items.find((u) => u.id === id);
    return item ? item.text : '';
  },
};
