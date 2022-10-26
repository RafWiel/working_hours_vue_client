module.exports = {
  required: (v) => !!v || 'Pole wymagane',
  integer: (v) => !Number.isNaN(parseInt(v, 10)) || 'Wymagana wartość liczbowa',
  float: (v) => !Number.isNaN(parseFloat(v, 10)) || 'Wymagana wartość liczbowa',
  email: (v) => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Nieprawidłowy adres e-mail',
  // eslint-disable-next-line
  phoneNumber: (v) => !v || /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/.test(v) || 'Nieprawidłowy numer telefonu',
  taxId: (v) => !v || /^[0-9]{10}$/.test(v) || 'Nieprawidłowy numer NIP',
};
