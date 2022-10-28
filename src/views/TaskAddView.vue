<template>
  <v-container
    fluid
    class="pa-0 d-flex flex-column flex-nowrap"
    style="height: 100%">
    <v-form
      ref="form"
      lazy-validation
      v-formFocusNextOnEnter>
      <!-- Form -->
      <v-row
        :class="$vuetify.breakpoint.mdAndUp ? 'pa-4' : 'pa-3 mt-0'"
        class="no-gutters" >
        <!-- Content column -->
        <v-col cols="12" class="pa-0">
          <v-row class="no-gutters mt-2">
            <v-col cols="3" md="2" lg="1">
              <v-menu
                v-model="item.isDatePickerVisible"
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
                  @input="item.isDatePickerVisible = false"/>
              </v-menu>
            </v-col>
            <!-- Project -->
            <v-col cols="6" sm="4" md="3" lg="2">
              <v-combobox
                :items="nameApi.values"
                :loading="nameApi.isLoading"
                :search-input.sync="nameApi.searchInput"
                :rules="[rules.required]"
                @change="getClientByName(item.client.name)"
                v-model="item.client.name"
                ref="clientName"
                hide-no-data
                hide-selected
                no-filter
                type="input"
                label="Projekt"
                />
            </v-col>
            <!-- Version -->
            <v-col cols="6" sm="4" md="3" lg="2" class="pl-2">
              <v-text-field
                :rules="[rules.required]"
                v-model.lazy="item.client.name"
                label="Wersja"
                type="input"
                hide-details="auto"
                validate-on-blur/>
            </v-col>
            <!-- Description -->
            <v-col
              cols="12" sm="4" md="6" lg="8"
              :class="$vuetify.breakpoint.smAndUp ? 'pl-2' : ''">
              <v-text-field
                :rules="[rules.required]"
                v-model.lazy="item.client.name"
                label="Opis"
                type="input"
                hide-details="auto"
                validate-on-blur/>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row
        :class="$vuetify.breakpoint.mdAndUp ? 'pa-4' : 'pa-3 mt-0'"
        class="no-gutters"
        justify="end">
        <v-col cols="12" sm="6" md="4" lg="2">
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
// import clientsService from '@/services/clients';
// import depositsService from '@/services/deposits';
// import TireInfo from '@/components/deposit/TireInfo.vue';
// import SignatureField from '@/components/SignatureField.vue';
import logger from '@/misc/logger';

export default {
  name: 'TaskAddView',
  computed: {
    date() {
      return moment(this.item.date).format('DD-MM-YYYY');
    },
  },
  data: () => ({
    isFormReset: false,
    item: null,
    newItem: {
      requestName: 'Nowe zlecenie',
      isDatePickerVisible: false,
      date: null,
      client: {
        name: null,
        companyName: null,
        phoneNumber: null,
        email: null,
      },
      tires: [
        {
          width: null,
          profile: null,
          diameter: null,
          dot: null,
          brand: null,
          tread: null,
          note: null,
        },
      ],
      isTires: false,
      isAlloys: false,
      isSteels: false,
      isScrews: false,
      isHubcups: false,
      tiresNote: null,
      tiresLocation: null,
      signature: {
        employee: null,
        client: null,
      },
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
  },
  methods: {
    async save() {
      // validation
      const v1 = this.$refs.form.validate();
      const v2 = this.$refs.employeeSignature.validate();
      const v3 = this.$refs.clientSignature.validate();
      if (!v1 || !v2 || !v3) {
        this.$nextTick(() => {
          const el = this.$el.querySelector('.v-messages.error--text:first-of-type');

          this.$vuetify.goTo(el, { offset: 60 });
        });

        return;
      }

      try {
        this.$emit('isProcessing', true);

        this.item.signature.employee = this.$refs.employeeSignature.getImageData();
        this.item.signature.client = this.$refs.clientSignature.getImageData();

        // console.log(JSON.stringify(this.item));

        // const response = await depositsService.create(this.item);

        // if (response.data.result) {
        //   this.$emit('isProcessing', false);
        //   this.$emit('showMessage', 'Depozyt', 'Zlecenie zapisane');
        //   this.resetForm();
        //   this.$vuetify.goTo(0);

        //   return;
        // }

        this.$emit('showMessage', 'Depozyt', 'Nieudany zapis');
      } catch (error) {
        this.processError(error);
      }

      this.$emit('isProcessing', false);
    },
    addArrayObject(item, array, maxCount, newItem) {
      if (this.isFormReset === true) return;

      // check if last item in array
      const index = array.indexOf(item);
      if (array.length >= maxCount || index < array.length - 1) return;

      // add new item
      array.push(newItem);
    },
    processError(error) {
      logger.error(error);
      this.$emit('isProcessing', false);

      if (error.response === undefined) {
        this.$emit('showMessage', 'Depozyt', 'Brak odpowiedzi z serwera');
        return;
      }

      logger.error(error.response.data);
      this.$emit('showMessage', 'Depozyt', error.response.data.message);
    },
    resetForm() {
      this.isFormReset = true;

      // deep copy
      this.item = JSON.parse(JSON.stringify(this.newItem));

      this.$refs.employeeSignature.resetCanvas();
      this.$refs.clientSignature.resetCanvas();
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

</style>
