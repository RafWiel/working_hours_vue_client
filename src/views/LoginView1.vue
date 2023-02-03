<template>
  <div class="mainContainer">
    <div class="mainWorkspace">
      <v-form
        class="mainForm"
        ref="form"
        lazy-validation>
        <v-card
          flat
          :class="$vuetify.breakpoint.mdAndUp ? 'mx-4 mt-4 mb-4 pa-4' : 'pa-3 mt-0'">
          <v-row class="no-gutters">
            <!-- Content column -->
            <v-col cols="12" class="pa-0">
              <!-- Title -->
              <v-row class="no-gutters">
                <v-col>
                  <h3 class="primary--text text--darken-1" >
                    Logowanie
                  </h3>
                </v-col>
              </v-row>
              <v-row class="no-gutters mt-2">
                <v-col cols="12">
                  <v-text-field
                    ref="firstControl"
                    id="username"
                    name="username"
                    type="text"
                    autocomplete="username"
                    label="Użytkownik"
                    hide-details="auto"
                    validate-on-blur
                    :rules="[rules.required]"
                    v-model.lazy="input.userName"
                    @keyup.enter="focusPasswordOrLogin"/>
                </v-col>
              </v-row>
              <v-row class="no-gutters mt-2">
                <v-col cols="12">
                  <v-text-field
                    id="password"
                    name="password"
                    ref="password"
                    label="Hasło"
                    class="mt-2"
                    hide-details="auto"
                    validate-on-blur
                    v-model.lazy="input.password"
                    :append-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :rules="[rules.required]"
                    :error-messages="errorMessage.password"
                    @click:append="isPasswordVisible = !isPasswordVisible"
                    @keyup.enter="login"
                    @keydown="errorMessage.password = ''"/>
                </v-col>
              </v-row>
              <v-row class="no-gutters mt-8" justify="end">
                <v-col cols="12" md="6">
                  <v-btn
                    id="submit"
                    depressed
                    block
                    color="primary"
                    class="save-btn"
                    @click="login">
                    Zaloguj się
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-form>
    </div>
  </div>
</template>

<script>
import logger from '@/misc/logger';
import string from '@/misc/string';
import authorizationService from '@/services/authorization';

export default {
  name: 'LoginView',
  computed: {
    size() {
      const size = { xs: 'small' }[this.$vuetify.breakpoint.name];
      return size ? { [size]: true } : {};
    },
  },
  data: () => ({
    isPasswordVisible: false,
    input: {
      userName: '',
      password: '',
    },
    errorMessage: { password: '' },
    rules: { required: (value) => !!value || 'Pole wymagane' },
  }),
  mounted() {
    // focus on first control
    //this.$refs.firstControl.focus();

    // reset store
    this.$store.dispatch('setUserName', null);
    this.$store.dispatch('setToken', null);
    this.$store.dispatch('setAccountManager', null);

    // reset local storage
    localStorage.userInfo = '';
  },
  methods: {
    async login() {
      if (this.$refs.form.validate() === false) {
        return;
      }

      // reset error message
      this.errorMessage.password = '';

      // set loading icon
      this.$emit('isProcessing', true);

      // request login
      await authorizationService.login({
        userName: this.input.userName,
        password: this.input.password,
      })
      .then((response) => {
        this.$emit('isProcessing', false);

        // console.log(response.data);

        // save user info to local storage
        const userInfo = {
          userName: this.input.userName,
          timestamp: new Date().getTime(),
          token: response.data.token,
          isAccountManager: response.data.isAccountManager,
        };

        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        // store user info
        this.$store.dispatch('setUserName', this.input.userName);
        this.$store.dispatch('setToken', response.data.token);
        this.$store.dispatch('setAccountManager', response.data.isAccountManager);

        // redirect to main page
        this.$router.replace({ name: 'Main' });
      })
      .catch((error) => {
        logger.error(error);
        this.$emit('isProcessing', false);

        if (error.response === undefined) {
          this.errorMessage.password = 'Brak odpowiedzi z serwera';
          return;
        }

        logger.error(error.response.data);
        this.errorMessage.password = error.response.data.message;
      });
    },
    focusPasswordOrLogin() {
      // focus next if data not ready
      if (string.isEmpty(this.input.userName) || string.isEmpty(this.input.password)) {
        this.$refs.password.focus();
        return;
      }

      // or else login
      this.login();
    },
  },
};
</script>

<style lang="scss" scoped>
  // @import url('https://fonts.googleapis.com/css?family=Montserrat:330,400,600,800');

  $font-family: 'Montserrat';

  .mainContainer {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;

    @media (min-width: 768px) {
      padding: 20px;
    }

    .logo {
      @media (max-width: 500px) {
        width: auto;
        height: 25px;
      }
    }
  }

  .mainWorkspace {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 75%;
  }

  .mainForm {
    display: flex;
    flex-direction: column;
    width: 400px;
    text-align: center;
  }

  [class*='text-h']{
    font-family: $font-family, sans-serif !important;
    font-weight: 600;
  }

</style>
