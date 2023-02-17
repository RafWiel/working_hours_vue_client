<template>
  <!-- container row center -->
  <v-container
    :style="$vuetify.breakpoint.smAndUp ? 'min-height: calc(85vh - 48px)' : ''"
    class="pa-0 d-flex flex-row align-center">
    <!-- container column center -->
    <v-container
      :style="$vuetify.breakpoint.xs ? 'min-height: calc(100vh - 48px)' : ''"
      class="pa-0 d-flex flex-column flex-nowrap align-center"
      fluid>
      <v-form
        :style="computed_width"
        ref="form"
        class="d-flex grow flex-column"
        id="data_form"
        lazy-validation
        v-formFocusNextOnEnter>
        <!-- Form -->
        <v-row
          :class="$vuetify.breakpoint.xs ? 'px-3' : ''"
          class="no-gutters grow pt-2">
          <!-- Content column -->
          <v-col cols="12" class="pa-0">
            <v-row class="no-gutters">
              <!-- Username -->
              <v-col cols="12">
                <v-text-field
                  :label="$t('loginView.username')"
                  :rules="[rules.required]"
                  @keyup.enter="focusPasswordOrLogin"
                  v-model.lazy="input.username"
                  ref="firstControl"
                  id="username"
                  name="username"
                  type="text"
                  autocomplete="username"
                  hide-details="auto"
                  validate-on-blur/>
              </v-col>
              <!-- Password -->
              <v-col
                cols="12"
                class="mt-2">
                <v-text-field
                  :append-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :rules="[rules.required]"
                  :error-messages="errorMessage.password"
                  :label="$t('loginView.password')"
                  @click:append="isPasswordVisible = !isPasswordVisible"
                  @keyup.enter="login"
                  @keydown="errorMessage.password = ''"
                  id="password"
                  name="password"
                  ref="password"
                  class="mt-2"
                  hide-details="auto"
                  validate-on-blur
                  v-model.lazy="input.password"/>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- Submit Button -->
        <v-row
          :class="$vuetify.breakpoint.xs ? 'px-3' : ''"
          class="no-gutters shrink mt-4 pb-3"
          justify="end">
          <v-col cols="12" sm="5">
            <v-btn
              @click="login"
              id="submit"
              depressed
              block
              color="primary"
              class="save-btn">
              {{ $t('loginView.login') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-container>
</template>

<script>
import logger from '@/plugins/logger';
import string from '@/misc/string';
import rules from '@/misc/rules';
import userAuthorizationService from '@/services/userAuthorization';

export default {
  name: 'LoginView',
  computed: {
    computed_width() {
      switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '';
          case 'sm': return 'width: 75%;';
          case 'md': return 'width: 50%;';
          case 'lg': return 'width: 40%;';
          case 'xl': return 'width: 30%;';
          default: return '';
        }
    },
  },
  data: () => ({
    isPasswordVisible: false,
    input: {
      username: '',
      password: '',
    },
    errorMessage: { password: '' },
    rules: {
      required: rules.required,
      password: rules.password,
    },
  }),
  mounted() {
    this.updateAppTitle();

    this.$root.$on('updateLocalization', () => {
      this.updateAppTitle();
    });

    // focus on first control
    //this.$refs.firstControl.focus();

    // reset store
    this.$store.dispatch('setUsername', null);
    this.$store.dispatch('setToken', null);
    this.$store.dispatch('setUserType', null);

    // reset local storage
    localStorage.userInfo = '';
  },
  methods: {
    async login() {
      // validate input
      if (this.$refs.form.validate() === false) return;

      // reset error message
      this.errorMessage.password = '';

      // set loading icon
      this.$emit('isProcessing', true);

      // request login
      await userAuthorizationService.login({
        username: this.input.username,
        password: this.input.password,
      })
      .then((response) => {
        this.$emit('isProcessing', false);

        if (response.status === 200) {
          // save user info to local storage
          const userInfo = {
            username: this.input.username,
            timestamp: new Date().getTime(),
            token: response.data.token,
            userType: response.data.userType,
          };

          localStorage.setItem('userInfo', JSON.stringify(userInfo));

          // store user info
          this.$store.dispatch('setUsername', this.input.username);
          this.$store.dispatch('setToken', response.data.token);
          this.$store.dispatch('setUserType', response.data.userType);

          // redirect to main page
          this.$router.replace({ name: 'main' });

          //refresh sidebar links
          this.$root.$emit('refreshSidebar');
        }
        else {
          this.showMessage(this.$t('message.operationFailed'));
        }
      })
      .catch((error) => this.processError('login', error));
    },
    focusPasswordOrLogin() {
      // focus next if data not ready
      if (string.isEmpty(this.input.username) || string.isEmpty(this.input.password)) {
        this.$refs.password.focus();
        return;
      }

      // or else login
      this.login();
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
      this.$emit('showMessage', this.$t('loginView.title'), message);
    },
    updateAppTitle() {
      this.$root.$emit('updateAppTitle', this.$t('loginView.title'));
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/assets/main.scss';
  @import url('https://fonts.googleapis.com/css?family=Montserrat:330,400,600,800');

  .semibold {
    font-family: 'Montserrat' !important;
    font-weight: 600;
  }

  .text_ellipsis {
    //overflow: hidden;
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  #data_form {
    width: 50%;

    @media (max-width: 960px) {
      width: 100%;
    }
  }

</style>
