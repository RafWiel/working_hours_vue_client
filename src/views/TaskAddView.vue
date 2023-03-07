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
                      :label="$t('taskView.date')"
                      v-model="item.creationDate"
                      readonly
                      hide-details="auto"
                      v-bind="attrs"
                      v-on="on"/>
                  </template>
                  <v-date-picker
                    :locale="$t('locale')"
                    v-model="item.creationDate"
                    no-title
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
                  :label="$t('taskView.client')"
                  v-model="item.client"
                  hide-no-data
                  hide-selected
                  hide-details="auto"
                  no-filter
                  type="input"/>
              </v-col>
              <!-- Project -->
              <v-col cols="12" class="mt-2">
                <v-combobox
                  :items="projectApi.values"
                  :loading="projectApi.isLoading"
                  :search-input.sync="projectApi.searchInput"
                  :rules="[rules.required]"
                  :label="$t('taskView.project')"
                  v-model.lazy="item.project"
                  hide-no-data
                  hide-selected
                  hide-details="auto"
                  no-filter
                  type="input"/>
              </v-col>
              <!-- Version -->
              <v-col cols="12" class="mt-2">
                <v-text-field
                  :label="$t('taskView.version')"
                  v-model.lazy="item.version"
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
                  :label="$t('taskView.description')"
                  v-model.lazy="item.description"
                  hide-details="auto"
                  validate-on-blur
                  auto-grow
                  rows="4"/>
              </v-col>
              <!-- Price -->
              <v-col
                v-if="item.type === taskType.priceBased"
                cols="12"
                class="mt-2">
                <v-text-field
                  :rules="[rules.required, rules.float]"
                  :label="$t('taskView.price')"
                  v-model.lazy="item.price"
                  ref="price"
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
                  :label="$t('taskView.hours')"
                  v-if="item.type === taskType.hoursBased"
                  v-model.lazy="item.hours"
                  ref="hours"
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
              {{$t('action.save')}}
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
import logger from '@/plugins/logger';
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
    isDatePickerVisible: false,
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
    this.updateAppTitle();

    this.$root.$on('updateLocalization', () => {
      this.updateAppTitle();
    });

    // hours based tasks are common, load last one
    if (this.$route.meta.type === this.taskType.hoursBased) {
      this.fetch();
    }
  },
  methods: {
    fetch() {
      // set loading icon
      this.$emit('isProcessing', true);

      // get item
      tasksService.getLast({
        type: this.$route.meta.type,
        client: this.item.client,
        project: this.item.project,
      })
      .then((response) => {
        if (!response.data) return;

        // copy project and version
        this.item.client = response.data.client;
        this.item.project = response.data.project;
        this.item.version = response.data.version;
        this.item.description = response.data.description;
      })
      .catch((error) => this.processError('fetch', error));

      this.$emit('isProcessing', false);
    },
    save() {
      // workaround: Combobox change event is delayed if button clicked right after, run save code next cycle to get proper values
      setTimeout(async () => {
        // validation
        if (this.$refs.form.validate() === false) {
          this.$nextTick(() => {
            const el = this.$el.querySelector('.v-messages.error--text:first-of-type');

            this.$vuetify.goTo(el, { offset: 60 });
          });

          return;
        }

        //console.log('item: ', JSON.stringify(this.item));

        try {
          this.$emit('isProcessing', true);

          //console.log(JSON.stringify(this.item));

          const response = await tasksService.create(this.item);

          if (response.status === 200) {
            this.$emit('isProcessing', false);
            this.showAutoMessage(this.$t('message.taskSaved'));
            this.$vuetify.goTo(0);

            // deep copy
            //this.lastItem = JSON.parse(JSON.stringify(this.item));

            return;
          }

          this.showMessage(this.$t('message.saveFailed'));
        }
        catch (error) {
          this.processError('save', error);
        }

        this.$emit('isProcessing', false);
      });
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
      this.$emit('showMessage', this.$t('taskAddView.title'), message);
    },
    showAutoMessage(message) {
      this.$emit('showAutoMessage', this.$t('taskAddView.title'), message);
    },
    updateAppTitle() {
      const title = this.item.type === taskType.hoursBased ? this.$t('taskAddView.titleAd') : this.$t('taskAddView.titleDs');

      this.$root.$emit('updateAppTitle', title);
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
        client: this.item.client,
      })
      .then((res) => {
        this.projectApi.values = res.data;
      })
      .catch((error) => logger.error(error))
      .finally(() => {
        this.projectApi.isLoading = false;
        this.fetch();
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
