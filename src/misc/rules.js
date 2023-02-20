import i18n from '@/plugins/i18n';

export default {
  required: (v) => !!v || i18n.t('rules.required'),
  integer: (v) => Number.isInteger(Number(v)) || i18n.t('rules.number'),
  float: (v) => !Number.isNaN(Number(v)) || i18n.t('rules.number'),
  email: (v) => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || i18n.t('rules.email'),
  // eslint-disable-next-line
  phoneNumber: (v) => !v || /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/.test(v) || i18n.t('rules.phoneNumber'),
  password: (v) => !v || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/.test(v) || i18n.t('rules.password'),
};
