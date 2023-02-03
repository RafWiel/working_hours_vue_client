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
                  @keydown="errorMessage.userName = ''"
                  v-model.lazy="input.firstName"
                  ref="firstControl"
                  type="text"
                  label="Imię"
                  hide-details="auto"
                  validate-on-blur/>
              </v-col>
              <!-- Lastname -->
              <v-col
                cols="12"
                class="mt-2">
                <v-text-field
                  :rules="[rules.required]"
                  @keydown="errorMessage.userName = ''"
                  v-model.lazy="input.lastName"
                  type="text"
                  label="Nazwisko"
                  hide-details="auto"
                  validate-on-blur/>
              </v-col>
              <!-- Username -->
              <v-col cols="12" class="mt-2">
                <v-text-field
                  :rules="[rules.required]"
                  :error-messages="errorMessage.userName"
                  @keydown="errorMessage.userName = ''"
                  v-model.lazy="input.userName"
                  type="text"
                  label="Użytkownik"
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
                  v-model="input.type"
                  item-value="id"
                  hide-details="auto"
                  label="Typ użytkownika"/>
              </v-col>
              <!-- Password -->
              <v-col cols="12" class="mt-2">
                <v-text-field
                    :append-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :rules="[rules.required, rules.password]"
                    :error-messages="errorMessage.password"
                    @click:append="isPasswordVisible = !isPasswordVisible"
                    @keydown="errorMessage.password = ''"
                    v-model.lazy="input.password"
                    label="Hasło"
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
                  @blur="verifyPasswordsMatch"
                  @click:append="isPasswordVisible = !isPasswordVisible"
                  @keydown="errorMessage.passwordConfirm = ''"
                  v-model.lazy="input.passwordConfirm"
                  label="Powtórz hasło"
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
                  @blur="verifyAdminPassword"
                  @click:append="isAdminPasswordVisible = !isAdminPasswordVisible"
                  @keydown="errorMessage.adminPassword = ''"
                  v-model.lazy="input.adminPassword"
                  label="Hasło administratora"
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
              Dodaj
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
import logger from '@/misc/logger';
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
    userNameDot() {
      return this.input.firstName === '' || this.input.lastName === '' ? '' : '.';
    },
  },
  data: () => ({
    messageTitle: 'Rejestracja',
    isPasswordVisible: false,
    isAdminPasswordVisible: false,
    userTypeItems: userType.items,
    input: {
      firstName: '',
      lastName: '',
      userName: null,
      userNameAuto: null,
      password: null,
      passwordConfirm: null,
      type: userType.administrator,
      adminPassword: null,
    },
    errorMessage: {
      userName: '',
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
    // focus on first control
    // this.$refs.firstControl.focus();
  },
  methods: {
    async create() {
      // validate input
      if (this.$refs.form.validate() === false
      || this.verifyAdminPassword() === false
      || this.verifyPasswordsMatch() === false
      || await this.verifyUserName() === false) return;

      // set loading icon
      this.$emit('isProcessing', true);

      // request login
      await usersService.create({
        firstName: this.input.firstName,
        lastName: this.input.lastName,
        userName: this.input.userName,
        password: this.input.password,
        type: this.input.type,
      })
      .then((response) => {
        this.$emit('isProcessing', false);

        // console.log(response.data);

        if (response.status === 200) {
          this.$emit('showMessage', this.messageTitle, `Użytkownik ${this.input.userName} został dodany`);
        }
        else {
          this.$emit('showMessage', this.messageTitle, 'Operacja zakończona niepowodzem');
        }
      })
      .catch((error) => this.processError('create', error));
    },
    async verifyUserName() {
      // check users
      const response = await usersService.isUniqueUserName({ userName: this.input.userName })
      .catch((error) => {
        logger.error(error);
        return false;
      });

      if (response.data === undefined) {
        return false;
      }

      this.errorMessage.userName = response.data.result === true ? '' : 'Nazwa użytkownika jest zajęta';

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

      this.errorMessage.passwordConfirm = 'Hasła muszą się zgadzać';
      return false;
    },
    verifyAdminPassword() {
      if (this.input.adminPassword !== process.env.VUE_APP_ADMIN_PASSWORD) {
        this.errorMessage.adminPassword = 'Nieprawidłowe hasło';
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
        this.$emit('showMessage', this.messageTitle, 'Brak odpowiedzi z serwera');
        return;
      }

      logger.error(`${this.$options.name}: ${method}: ${error.response.data.details ? error.response.data.details : error.response.data.message}`);
      this.$emit('showMessage', this.messageTitle, error.response.data.message);
    },
  },
  watch: {
    'input.firstName': function firstName(val) {
      if (this.input.userName === this.input.userNameAuto) {
        this.input.userName = this.removePolishChars(`${val}${this.userNameDot}${this.input.lastName}`);
        this.input.userNameAuto = this.input.userName;
      }
    },
    'input.lastName': function lastName(val) {
      if (this.input.userName === this.input.userNameAuto) {
        this.input.userName = this.removePolishChars(`${this.input.firstName}${this.userNameDot}${val}`);
        this.input.userNameAuto = this.input.userName;
      }
    },
    'input.userName': debounce(async function userName(val) {
      // check if input changed by user
      if (val !== this.input.userNameAuto) {
        this.input.userNameAuto = ''; // reset auto, updating first or last name will not change username anymore
      }

      // verify if unique username
      await this.verifyUserName();
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
