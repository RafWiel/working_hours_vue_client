<template>
  <div style="width: 150px">
  <v-select
    :items="languages"
    label="Lang"
    @click.stop
    @change="setLocale"
    v-model="$i18n.locale"
    item-text="text"
    item-value="code"
    hide-details="auto"
    clearable/>
  </div>
</template>
<script>
import logger from '@/plugins/logger';
import usersService from '@/services/users';

export default {
  name: 'LocaleChanger',
  data: () => ({
    languages: [
      { code: 'en', text: 'English' },
      { code: 'pl', text: 'Polski' },
    ],
  }),
  methods: {
    async setLocale() {
      this.$emit('isProcessing', true);

      await usersService.setLocale({
        username: this.$store.state.username,
        locale: this.$i18n.locale,
      })
      .then((response) => {
        this.$emit('isProcessing', false);

        if (response.status === 200) {
          const userInfo = {
            username: this.$store.state.username,
            timestamp: new Date().getTime(),
            token: this.$store.state.token,
            userType: this.$store.state.userType,
            locale: this.$i18n.locale,
          };

          localStorage.setItem('userInfo', JSON.stringify(userInfo));

          // store user info
          this.$store.dispatch('setUser', userInfo);

          this.$root.$emit('updateLocalization');
        }
        else {
          this.showMessage(this.$t('message.operationFailed'));
        }
      })
      .catch((error) => this.processError('setLocale', error));
    },
    processError(method, error) {
      this.$emit('isProcessing', false);

      if (error.response === undefined) {
        this.showMessage(this.$t('message.noResponse'));
        return;
      }

      logger.error(`${this.$options.name}: ${method}: ${error.response.data.details ? error.response.data.details : error.response.data.message}`);
      const errorCode = error.response.data.code ? error.response.data.code : error.response.status;

      this.showMessage(this.$t(`htmlError.${errorCode}`));
    },
    showMessage(message) {
      this.$emit('showMessage', this.$t('common.error'), message);
    },
  },
};
</script>
<style lang="scss" scoped>
  @import '@/assets/main.scss';

  .app-bar {
    background-color: $app-bar-color !important;
  }

</style>
