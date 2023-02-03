module.exports = {
  isEmpty(str) {
    return (!str || str.length === 0);
  },

  limitString(str, length) {
    if (str.length > length) {
      return str.substring(0, length).concat('...');
    }

    return str;
  },
};
