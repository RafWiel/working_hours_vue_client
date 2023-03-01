<template>

  <v-menu
    v-model="isListVisible"
    offset-y
    nudge-bottom="12"
    transition="slide-y-transition"
    class="pa-0"
    min-width="120">
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        v-bind="attrs"
        v-on="on"
        color="grey lighten-2">
        mdi-web
      </v-icon>
    </template>
    <v-list dense>
      <v-subheader>{{ $t('common.language') }}</v-subheader>
      <v-list-item-group
        @change="setLocale"
        v-model="selectedItem"
        color="primary">
        <v-list-item
          v-for="(language, i) in languages"
          :key="i">
          {{ language.text }}
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>
<script>
import logger from '@/plugins/logger';
import usersService from '@/services/users';

export default {
  name: 'LocaleChanger',
  data: () => ({
    isListVisible: false,
    selectedItem: null,
    languages: [
      { id: 0, code: 'en', text: 'English' },
      { id: 1, code: 'pl', text: 'Polski' },
    ],
  }),
  mounted() {
    this.setSelectedItem();
  },
  methods: {
    async setLocale() {
      this.$emit('isProcessing', true);

      this.$i18n.locale = this.selectedItem ? this.languages[this.selectedItem].code : 'en';

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
    setSelectedItem() {
      const { id } = this.languages.filter((u) => u.code === this.$i18n.locale)[0];

      this.selectedItem = id;
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
