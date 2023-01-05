<template>
  <v-container
    :style="$vuetify.breakpoint.smAndUp ? 'min-height: calc(85vh - 48px)' : ''"
    class="pa-0 d-flex flex-row align-center">
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
              <!-- Date -->
              <v-col cols="12">
                <v-menu
                  v-model="isDatePickerVisible"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  ref="creationDate"
                  transition="scale-transition"
                  offset-y
                  class="pa-0"
                  min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :rules="[rules.required]"
                      v-model="item.creationDate"
                      label="Data"
                      readonly
                      hide-details="auto"
                      v-bind="attrs"
                      v-on="on"/>
                  </template>
                  <v-date-picker
                    v-model="item.creationDate"
                    no-title
                    locale="pl-pl"
                    @input="isDatePickerVisible = false"/>
                </v-menu>
              </v-col>
              <!-- Client -->
              <v-col
                v-if="item.type === taskType.priceBased"
                cols="12"
                class="mt-2">
                <v-combobox
                  :items="clientApi.values"
                  :loading="clientApi.isLoading"
                  :search-input.sync="clientApi.searchInput"
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
                  :items="projectApi.values"
                  :loading="projectApi.isLoading"
                  :search-input.sync="projectApi.searchInput"
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
              <!-- Price -->
              <v-col
                v-if="item.type === taskType.priceBased"
                cols="12"
                class="mt-2">
                <v-text-field
                  :rules="[rules.required]"
                  v-model.lazy="item.price"
                  ref="price"
                  label="Cena"
                  type="input"
                  hide-details="auto"
                  validate-on-blur/>
              </v-col>
              <!-- Hours -->
              <v-col
                cols="12"
                class="mt-2">
                <v-text-field
                  :rules="[rules.required, rules.float]"
                  v-if="item.type === taskType.hoursBased"
                  v-model.lazy="item.hours"
                  ref="hours"
                  label="Ilość godzin"
                  type="input"
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
              @click="save">
              Zapisz
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-container>
</template>

<script>
import debounce from 'lodash.debounce';
import moment from 'moment';
import rules from '@/misc/rules';
import logger from '@/misc/logger';
import tasksService from '@/services/tasks';
import clientsService from '@/services/clients';
import projectsService from '@/services/projects';
import taskType from '@/enums/taskType';

export default {
  name: 'TaskAddView',
  computed: {
    date() {
      return moment(this.item.creationDate).format('DD-MM-YYYY');
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
    isDatePickerVisible: false,
    lastItem: null,
    item: {
      creationDate: null,
      type: null,
      client: null,
      project: null,
      version: null,
      description: null,
      hours: null,
      price: null,
    },
    clientApi: {
      searchInput: null,
      values: [],
      isLoading: false,
    },
    projectApi: {
      searchInput: null,
      values: [],
      isLoading: false,
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
      float: rules.float,
    },
    taskType,
  }),
  created() {
    this.item.creationDate = moment(new Date()).format('YYYY-MM-DD');
    this.item.type = this.$route.meta.type;
  },
  mounted() {
    this.fetch();
  },
  methods: {
    fetch() {
      // set loading icon
      this.$emit('isProcessing', true);

      // get item
      tasksService.getLast({ type: this.$route.meta.type })
      .then((response) => {
        if (!response.data) return;
        console.log(response.data);
        this.lastItem = response.data;

        // copy project and version
        this.item.client = this.lastItem.client;
        this.item.project = this.lastItem.project;
        this.item.version = this.lastItem.version;
      })
      .catch((error) => this.processError(error));

      this.$emit('isProcessing', false);
    },
    async save() {
      // validation
      if (this.$refs.form.validate() === false) {
        this.$nextTick(() => {
          const el = this.$el.querySelector('.v-messages.error--text:first-of-type');

          this.$vuetify.goTo(el, { offset: 60 });
        });

        return;
      }

      console.log('item: ', JSON.stringify(this.item));
      console.log('old: ', JSON.stringify(this.lastItem));

      try {
        this.$emit('isProcessing', true);

        console.log(JSON.stringify(this.item));

        const response = await tasksService.create(this.item);

        if (response.status === 200) {
          this.$emit('isProcessing', false);
          this.$emit('showMessage', this.messageTitle, 'Zadanie zapisane');
          this.$vuetify.goTo(0);

          // deep copy
          this.lastItem = JSON.parse(JSON.stringify(this.item));

          return;
        }

        this.$emit('showMessage', this.messageTitle, 'Nieudany zapis');
      }
      catch (error) {
        this.processError(error);
      }

      this.$emit('isProcessing', false);
    },
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
  },
  watch: {
    'clientApi.searchInput': debounce(async function searchInput(val) {
      if (this.clientApi.isLoading) return;

      this.clientApi.isLoading = true;

      clientsService.getNamesDistinct({ filter: val })
      .then((res) => {
        this.clientApi.values = res.data;
      })
      .catch((error) => logger.error(error))
      .finally(() => {
        this.clientApi.isLoading = false;
      });
    }, 500, { maxWait: 5000 }),
    'projectApi.searchInput': debounce(async function searchInput(val) {
      if (this.projectApi.isLoading) return;

      this.projectApi.isLoading = true;

      projectsService.getNamesDistinct({
        'task-type': this.$route.meta.type,
        filter: val,
      })
      .then((res) => {
        this.projectApi.values = res.data;
      })
      .catch((error) => logger.error(error))
      .finally(() => {
        this.projectApi.isLoading = false;
      });
    }, 500, { maxWait: 5000 }),
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
