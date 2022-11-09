<template>
  <v-container
    :class="$vuetify.breakpoint.smAndUp ? 'my-12' : ''"
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
        :class="$vuetify.breakpoint.xs ? 'px-3 pt-2' : ''"
        class="no-gutters grow">
        <!-- Content column -->
        <v-col cols="12" class="pa-0">
          <v-row class="no-gutters">
            <v-col cols="12">
              <v-menu
                v-model="isDatePickerVisible"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                class="pa-0"
                min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="item.date"
                    label="Data"
                    readonly
                    hide-details="auto"
                    v-bind="attrs"
                    v-on="on"/>
                </template>
                <v-date-picker
                  v-model="item.date"
                  no-title
                  locale="pl-pl"
                  @input="isDatePickerVisible = false"/>
              </v-menu>
            </v-col>
            <!-- Client -->
            <v-col cols="12" class="mt-2">
              <v-combobox
                :items="nameApi.values"
                :loading="nameApi.isLoading"
                :search-input.sync="nameApi.searchInput"
                :rules="[rules.required]"
                v-model="item.client"
                hide-no-data
                hide-selected
                hide-details="auto"
                no-filter
                type="input"
                label="Klient"
                />
            </v-col>
            <!-- Project -->
            <v-col cols="12" class="mt-2">
              <v-combobox
                :items="nameApi.values"
                :loading="nameApi.isLoading"
                :search-input.sync="nameApi.searchInput"
                :rules="[rules.required]"
                v-model="item.project"
                hide-no-data
                hide-selected
                hide-details="auto"
                no-filter
                type="input"
                label="Projekt"
                />
            </v-col>
            <!-- Version -->
            <v-col cols="12" class="mt-2">
              <v-text-field
                :rules="[rules.required]"
                v-model.lazy="item.version"
                label="Wersja"
                type="input"
                hide-details="auto"
                validate-on-blur/>
            </v-col>
            <!-- Price -->
            <v-col
              cols="12"
              class="mt-2">
              <v-text-field
                :rules="[rules.required]"
                v-model.lazy="item.price"
                label="Cena"
                type="input"
                hide-details="auto"
                validate-on-blur/>
            </v-col>
            <!-- Description -->
            <v-col
              cols="12"
              class="mt-2">
              <v-textarea
                :rules="[rules.required]"
                label="Opis"
                hide-details="auto"
                validate-on-blur
                auto-grow
                rows="4"
                v-model.lazy="item.description"/>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <!-- Save Button -->
      <v-row
        :class="$vuetify.breakpoint.xs ? 'px-3 pb-3' : ''"
        class="no-gutters shrink mt-4"
        justify="end">
        <v-col cols="12" sm="5">
          <v-btn
            depressed
            block
            class="save-btn"
            @click="save">
            Zapisz
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
// import debounce from 'lodash.debounce';
import moment from 'moment';
import rules from '@/misc/rules';
import logger from '@/misc/logger';
// import clientsService from '@/services/clients';
import tasksService from '@/services/datasoft/tasks';
// import TireInfo from '@/components/deposit/TireInfo.vue';
// import SignatureField from '@/components/SignatureField.vue';


export default {
  name: 'TaskAddView',
  computed: {
    date() {
      return moment(this.item.date).format('DD-MM-YYYY');
    },
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
    messageTitle: 'Nowe zadanie',
    isFormReset: false,
    isDatePickerVisible: false,
    item: null,
    newItem: {
      date: null,
      client: null,
      project: null,
      version: null,
      price: null,
      description: null,
    },
    nameApi: {
      searchInput: null,
      values: [],
      isLoading: false,
    },
    companyNameApi: {
      searchInput: null,
      values: [],
      isLoading: false,
    },
    phoneNumberApi: {
      searchInput: null,
      values: [],
      isLoading: false,
    },
    rules: {
      required: rules.required,
      integer: rules.integer,
      phoneNumber: rules.phoneNumber,
    },
  }),
  created() {
    // deep copy
    this.item = JSON.parse(JSON.stringify(this.newItem));
    this.item.date = moment(new Date()).format('YYYY-MM-DD');
  },
  methods: {
    async save() {
      // validation
      if (this.$refs.form.validate() === false) {
        this.$nextTick(() => {
          const el = this.$el.querySelector('.v-messages.error--text:first-of-type');

          this.$vuetify.goTo(el, { offset: 60 });
        });

        return;
      }

      try {
        this.$emit('isProcessing', true);

        console.log(JSON.stringify(this.item));

        const response = await tasksService.create(this.item);

        if (response.data.result) {
          this.$emit('isProcessing', false);
          this.$emit('showMessage', this.messageTitle, 'Zadanie zapisane');
          this.resetForm();
          this.$vuetify.goTo(0);

          return;
        }

        this.$emit('showMessage', this.messageTitle, 'Nieudany zapis');
      }
      catch (error) {
        this.processError(error);
      }

      this.$emit('isProcessing', false);
    },
    // addArrayObject(item, array, maxCount, newItem) {
    //   if (this.isFormReset === true) return;

    //   // check if last item in array
    //   const index = array.indexOf(item);
    //   if (array.length >= maxCount || index < array.length - 1) return;

    //   // add new item
    //   array.push(newItem);
    // },
    processError(error) {
      logger.error(error);
      this.$emit('isProcessing', false);

      if (error.response === undefined) {
        this.$emit('showMessage', this.messageTitle, 'Brak odpowiedzi z serwera');
        return;
      }

      logger.error(error.response.data);
      this.$emit('showMessage', this.messageTitle, error.response.data.message);
    },
    resetForm() {
      this.isFormReset = true;

      // deep copy
      this.item = JSON.parse(JSON.stringify(this.newItem));

      this.$refs.form.reset();

      setTimeout(() => {
        this.isFormReset = false;
      }, 1000);
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
