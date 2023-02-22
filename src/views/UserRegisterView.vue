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
              <!-- Firstname -->
              <v-col cols="12">
                <v-text-field
                  :rules="[rules.required]"
                  :label="$t('userRegisterView.firstName')"
                  @keydown="errorMessage.username = ''"
                  v-model.lazy="input.firstName"
                  ref="firstControl"
                  type="text"
                  hide-details="auto"
                  validate-on-blur/>
              </v-col>
              <!-- Lastname -->
              <v-col
                cols="12"
                class="mt-2">
                <v-text-field
                  :rules="[rules.required]"
                  :label="$t('userRegisterView.lastName')"
                  @keydown="errorMessage.username = ''"
                  v-model.lazy="input.lastName"
                  type="text"
                  hide-details="auto"
                  validate-on-blur/>
              </v-col>
              <!-- Username -->
              <v-col cols="12" class="mt-2">
                <v-text-field
                  :rules="[rules.required]"
                  :error-messages="errorMessage.username"
                  :label="$t('userRegisterView.username')"
                  @keydown="errorMessage.username = ''"
                  v-model.lazy="input.username"
                  type="text"
                  autocomplete="off"
                  hide-details="auto"
                  validate-on-blur/>
              </v-col>
              <!-- Type -->
              <v-col
                cols="12"
                class="mt-2">
                <v-select
                  :items="userTypeItems"
                  :label="$t('userRegisterView.userType')"
                  v-model="input.type"
                  item-value="id"
                  hide-details="auto"/>
              </v-col>
              <!-- Password -->
              <v-col cols="12" class="mt-2">
                <v-text-field
                  :append-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :rules="[rules.required, rules.password]"
                  :error-messages="errorMessage.password"
                  :label="$t('userRegisterView.password')"
                  @click:append="isPasswordVisible = !isPasswordVisible"
                  @keydown="errorMessage.password = ''"
                  v-model.lazy="input.password"
                  autocomplete="new-password"
                  class="mt-2"
                  hide-details="auto"
                  validate-on-blur/>
              </v-col>
              <!-- Confirm password -->
              <v-col
                cols="12"
                class="mt-2">
                <v-text-field
                  :append-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :rules="[rules.required, rules.password]"
                  :error-messages="errorMessage.passwordConfirm"
                  :label="$t('userRegisterView.passwordConfirm')"
                  @blur="verifyPasswordsMatch"
                  @click:append="isPasswordVisible = !isPasswordVisible"
                  @keydown="errorMessage.passwordConfirm = ''"
                  v-model.lazy="input.passwordConfirm"
                  autocomplete="new-password"
                  class="mt-2"
                  hide-details="auto"
                  validate-on-blur/>
              </v-col>
              <!-- Admin password -->
              <v-col
                cols="12"
                class="mt-2">
                <v-text-field
                  :append-icon="isAdminPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="isAdminPasswordVisible ? 'text' : 'password'"
                  :error-messages="errorMessage.adminPassword"
                  :label="$t('userRegisterView.administratorPassword')"
                  @blur="verifyAdminPassword"
                  @click:append="isAdminPasswordVisible = !isAdminPasswordVisible"
                  @keydown="errorMessage.adminPassword = ''"
                  v-model.lazy="input.adminPassword"
                  autocomplete="new-password"
                  class="mt-2"
                  hide-details="auto"
                  validate-on-blur/>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- Save Button -->
        <v-row
          :class="$vuetify.breakpoint.xs ? 'px-3' : ''"
          class="no-gutters shrink mt-4 pb-3"
          justify="end">
          <v-col cols="12" sm="5">
            <v-btn
              depressed
              block
              class="save-btn"
              @click="create">
              {{$t('action.add')}}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-container>
</template>

<script>
import debounce from 'lodash.debounce';
import rules from '@/misc/rules';
import logger from '@/plugins/logger';
import userType from '@/enums/userType';
import usersService from '@/services/users';

export default {
  name: 'UserRegisterView',
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
    usernameDot() {
      return this.input.firstName === '' || this.input.lastName === '' ? '' : '.';
    },
    userTypeItems() {
      return userType.getItems();
    },
  },
  data: () => ({
    isPasswordVisible: false,
    isAdminPasswordVisible: false,
    input: {
      firstName: '',
      lastName: '',
      username: null,
      usernameAuto: null,
      password: null,
      passwordConfirm: null,
      type: userType.administrator,
      adminPassword: null,
    },
    errorMessage: {
      username: '',
      password: '',
      passwordConfirm: '',
      adminPassword: '',
    },
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
    // this.$refs.firstControl.focus();
  },
  methods: {
    async create() {
      // validate input
      if (this.$refs.form.validate() === false
      || this.verifyAdminPassword() === false
      || this.verifyPasswordsMatch() === false
      || await this.verifyUsername() === false) return;

      // set loading icon
      this.$emit('isProcessing', true);

      // request login
      await usersService.create({
        firstName: this.input.firstName,
        lastName: this.input.lastName,
        username: this.input.username,
        password: this.input.password,
        type: this.input.type,
      })
      .then((response) => {
        this.$emit('isProcessing', false);

        // console.log(response.data);
        if (response.status === 200) {
          this.showMessage(this.$t('message.userRegisterSuccess', { username: this.input.username }));
        }
        else {
          this.showMessage(this.$t('message.operationFailed'));
        }
      })
      .catch((error) => this.processError('create', error));
    },
    async verifyUsername() {
      // check users
      const response = await usersService.isUniqueUsername({ username: this.input.username })
      .catch((error) => {
        logger.error(error);
        return false;
      });

      if (response.data === undefined) {
        return false;
      }

      this.errorMessage.username = response.data.result === true ? '' : this.$t('userRegisterView.usernameNotAvailable');

      return response.data.result;
    },
    verifyPasswordsMatch() {
      if (!this.input.password || !this.input.passwordConfirm) {
        this.errorMessage.passwordConfirm = '';
        return true;
      }

      if (this.input.password === this.input.passwordConfirm) {
        this.errorMessage.passwordConfirm = '';
        return true;
      }

      this.errorMessage.passwordConfirm = this.$t('userRegisterView.passwordsDontMatch');
      return false;
    },
    verifyAdminPassword() {
      if (this.input.adminPassword !== process.env.VUE_APP_ADMIN_PASSWORD) {
        this.errorMessage.adminPassword = this.$t('userRegisterView.incorrectPassword');
        return false;
      }

      this.errorMessage.adminPassword = '';
      return true;
    },
    removePolishChars(text) {
      return text
        .replace(/ą/g, 'a')
        .replace(/Ą/g, 'A')
        .replace(/ć/g, 'c')
        .replace(/Ć/g, 'C')
        .replace(/ę/g, 'e')
        .replace(/Ę/g, 'E')
        .replace(/ł/g, 'l')
        .replace(/Ł/g, 'L')
        .replace(/ń/g, 'n')
        .replace(/Ń/g, 'N')
        .replace(/ó/g, 'o')
        .replace(/Ó/g, 'O')
        .replace(/ś/g, 's')
        .replace(/Ś/g, 'S')
        .replace(/ż/g, 'z')
        .replace(/Ż/g, 'Z')
        .replace(/ź/g, 'z')
        .replace(/Ź/g, 'Z')
        .toLowerCase();
    },
    processError(method, error) {
      this.$emit('isProcessing', false);

      if (error.response === undefined) {
        this.showMessage(this.$t('message.noResponse'));
        return;
      }

      logger.error(`${this.$options.name}: ${method}: ${error.response.data.details ? error.response.data.details : error.response.data.message}`);
      this.showMessage(this.$t(`htmlError.${error.response.status}`));
    },
    showMessage(message) {
      this.$emit('showMessage', this.$t('userRegisterView.title'), message);
    },
    updateAppTitle() {
      this.$root.$emit('updateAppTitle', this.$t('userRegisterView.title'));
    },
  },
  watch: {
    'input.firstName': function firstName(val) {
      if (this.input.username === this.input.usernameAuto) {
        this.input.username = this.removePolishChars(`${val}${this.usernameDot}${this.input.lastName}`);
        this.input.usernameAuto = this.input.username;
      }
    },
    'input.lastName': function lastName(val) {
      if (this.input.username === this.input.usernameAuto) {
        this.input.username = this.removePolishChars(`${this.input.firstName}${this.usernameDot}${val}`);
        this.input.usernameAuto = this.input.username;
      }
    },
    'input.username': debounce(async function username(val) {
      // check if input changed by user
      if (val !== this.input.usernameAuto) {
        this.input.usernameAuto = ''; // reset auto, updating first or last name will not change username anymore
      }

      // verify if unique username
      await this.verifyUsername();
    }, 1000, { maxWait: 5000 }),
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
