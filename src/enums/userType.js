const administrator = 0;
const datasoft = 1;
const aldridge = 2;

module.exports = {
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
};
