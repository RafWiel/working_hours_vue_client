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
                    :rules="[rules.required]"
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
            <!-- Hours -->
            <v-col
              cols="12"
              class="mt-2">
              <v-text-field
                :rules="[rules.required, rules.float]"
                v-model.lazy="item.hoursCount"
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
import debounce from 'lodash.debounce';
import moment from 'moment';
import rules from '@/misc/rules';
import tasksService from '@/services/aldridge/tasks';
import logger from '@/misc/logger';

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
    isDatePickerVisible: false,
    newestItem: null,
    item: {
      date: null,
      project: null,
      version: null,
      hoursCount: null,
    },
    projectApi: {
      searchInput: null,
      values: [],
      isLoading: false,
    },
    rules: {
      required: rules.required,
      float: rules.float,
    },
  }),
  created() {
    this.item.date = moment(new Date()).format('YYYY-MM-DD');
  },
  mounted() {
    this.fetch();
  },
  methods: {
    fetch() {
      // set loading icon
      this.$emit('isProcessing', true);

      // get item
      tasksService.getNewest()
      .then((response) => {
        if (!response.data) return;
        console.log(response.data);
        this.newestItem = response.data;

        // copy project and version
        this.item.project = this.newestItem.project;
        this.item.version = this.newestItem.version;
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
      console.log('old: ', JSON.stringify(this.newestItem));

      // prevent duplicate
      if (this.isDuplicate(this.item, this.newestItem)) {
        this.$emit('showMessage', this.messageTitle, 'Wystąpił błąd: Duplikat\r\nZapis anulowany');
        return;
      }

      try {
        this.$emit('isProcessing', true);

        console.log(JSON.stringify(this.item));

        const response = await tasksService.create(this.item);

        if (response.data.result) {
          this.$emit('isProcessing', false);
          this.$emit('showMessage', this.messageTitle, 'Zadanie zapisane');
          this.$vuetify.goTo(0);

          // deep copy
          this.newestItem = JSON.parse(JSON.stringify(this.item));

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
    isDuplicate(item1, item2) {
      if (item1 === null || item2 === null) {
        return false;
      }

      if (new Date(item1.date).getTime() !== new Date(item2.date).getTime()) {
        return false;
      }

      if (item1.project !== item2.project) {
        return false;
      }

      if (item1.version !== item2.version) {
        return false;
      }

      if (parseFloat(item1.hoursCount) !== parseFloat(item2.hoursCount)) {
        return false;
      }

      return true;
    },
  },
  watch: {
    'projectApi.searchInput': debounce(async function searchInput(val) {
      if (this.projectApi.isLoading) return;

      this.projectApi.isLoading = true;

      tasksService.getProjectsDistinct({ filter: val })
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
