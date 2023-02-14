<template>
  <v-expansion-panels
    accordion
    value="2"
    flat>
    <v-expansion-panel class="app-background">
      <v-expansion-panel-header class="pa-0">
        <v-container fluid class="pa-0 mr-4">
          <v-row class="no-gutters">
            <!-- Szukaj -->
            <v-col
              cols="6"
              sm="5"
              lg="6">
              <v-text-field
              @click.stop
                :label="$t('filter.search')"
                @keydown.enter.prevent
                @keyup.space.prevent
                @input="emitDelayedEvent(true)"
                ref="search"
                prepend-inner-icon="mdi-magnify"
                type="input"
                clearable
                hide-details="auto"
                validate-on-blur
                v-model.lazy.trim="filter.search"/>
            </v-col>
            <!-- Okres -->
            <v-col
              class="pl-2"
              cols="6"
              sm="3"
              lg="2">
              <v-select
                :disabled="!!filter.startDate || !!filter.stopDate"
                :items="timePeriodItems"
                :label="$t('filter.timePeriod')"
                @click.stop
                @change="emitEvent"
                ref="timePeriod"
                v-model="filter.timePeriod"
                item-value="id"
                hide-details="auto"/>
            </v-col>
            <!-- Rozliczenie -->
            <v-col
              :class="$vuetify.breakpoint.smAndUp ? 'pl-2' : 'mt-2'"
              cols="6"
              sm="2"
              lg="2">
              <v-select
                :items="settlementTypeItems"
                :label="$t('filter.settlement')"
                @click.stop
                @change="emitEvent"
                v-model="filter.settlementType"
                item-value="id"
                hide-details="auto"/>
            </v-col>
            <!-- Typ zadania -->
            <v-col
              :class="$vuetify.breakpoint.smAndUp ? 'pl-2' : 'pl-2 mt-2'"
              cols="6"
              sm="2"
              lg="2">
              <v-select
                :items="taskTypeItems"
                :disabled="!isAdministrator"
                :label="$t('filter.client')"
                @click.stop
                @change="emitEvent"
                v-model="filter.taskType"
                item-value="id"
                hide-details="auto"/>
            </v-col>
          </v-row>
        </v-container>
      </v-expansion-panel-header>
      <v-expansion-panel-content class="mr-n2">
        <v-container
          fluid
          class="pa-0"
          :class="$vuetify.breakpoint.mdAndUp ? 'ml-n6' : 'ml-n6 mt-2 mr-n2 pr-n4'">
          <v-row class="no-gutters">
            <!-- Data początkowa -->
            <v-col
              :class="$vuetify.breakpoint.smAndUp ? '' : 'mt-1'"
              cols="6"
              sm="5"
              lg="2">
              <v-menu
                :close-on-content-click="false"
                :nudge-right="40"
                v-model="isStartDatePickerVisible"
                transition="scale-transition"
                offset-y
                class="pa-0"
                min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :disabled="filter.timePeriod !== 0"
                    :label="$t('filter.startDate')"
                    @click:clear="filter.startDate = 0; emitEvent()"
                    v-model="filter.startDate"
                    readonly
                    clearable
                    hide-details="auto"
                    v-bind="attrs"
                    v-on="on"/>
                </template>
                <v-date-picker
                  :locale="$t('locale')"
                  @input="isStartDatePickerVisible = false"
                  @change="emitEvent"
                  v-model="filter.startDate"
                  no-title/>
              </v-menu>
            </v-col>
            <!-- Data końcowa -->
            <v-col
              cols="6"
              sm="7"
              lg="10"
              :class="$vuetify.breakpoint.smAndUp ? 'pl-2' : 'pl-2 mt-1'">
              <v-menu
                :close-on-content-click="false"
                :nudge-right="40"
                v-model="isStopDatePickerVisible"
                transition="scale-transition"
                offset-y
                class="pa-0"
                min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :disabled="filter.timePeriod !== 0"
                    :label="$t('filter.stopDate')"
                    @click:clear="filter.stopDate = 0; emitEvent()"
                    v-model="filter.stopDate"
                    readonly
                    clearable
                    hide-details="auto"
                    v-bind="attrs"
                    v-on="on"/>
                </template>
                <v-date-picker
                  :locale="$t('locale')"
                  @input="isStopDatePickerVisible = false"
                  @change="emitEvent"
                  v-model="filter.stopDate"
                  no-title/>
              </v-menu>
            </v-col>
          </v-row>
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import debounce from 'lodash.debounce'; // debounce - opoznienie
import timePeriod from '@/enums/timePeriod';
import taskType from '@/enums/taskType';
import userType from '@/enums/userType';
import settlementType from '@/enums/settlementType';

export default {
  name: 'TaskListViewFilter',
  props: {
    route: String,
    clientId: Number,
  },
  computed: {
    isAdministrator() {
      return this.$store && this.$store.state.userType === userType.administrator;
    },
    timePeriodItems() {
      return timePeriod.getItems();
    },
    settlementTypeItems() {
      return settlementType.getItems();
    },
    taskTypeItems() {
      return taskType.getItems();
    },
  },
  data: () => ({
    filter: {
      search: '',
      timePeriod: 0,
      startDate: null,
      stopDate: null,
      taskType: 0,
      settlementType: 0,
    },
    isStartDatePickerVisible: false,
    isStopDatePickerVisible: false,
  }),
  mounted() {
    if (this.$store && this.$store.state.userType === userType.datasoft) {
      this.filter.taskType = taskType.priceBased;
    }

    if (this.$store && this.$store.state.userType === userType.aldridge) {
      this.filter.taskType = taskType.hoursBased;
    }

    //unsettled by default
    if (!this.$route.query['settlement-type']) {
      this.filter.settlementType = settlementType.unsettled;
      this.emitEvent();
    }
  },
  methods: {
    emitDelayedEvent: debounce(function emit() {
      this.emitEvent();
    }, 500),
    emitEvent() {
      const route = {
        name: this.route,
        query: {},
      };

      if (this.filter.search) {
        route.query.search = this.filter.search;
      }

      if (this.filter.timePeriod !== timePeriod.all) {
        route.query['time-period'] = this.filter.timePeriod;
      }

      if (this.filter.taskType !== taskType.all) {
        route.query['task-type'] = this.filter.taskType;
      }

      if (this.filter.settlementType !== settlementType.none) {
        route.query['settlement-type'] = this.filter.settlementType;
      }

      if (this.filter.startDate) {
        route.query['start-date'] = this.filter.startDate;
      }

      if (this.filter.stopDate) {
        route.query['stop-date'] = this.filter.stopDate;
      }

      //client id comes from previous route.query
      if (this.clientId) {
        route.query['client-id'] = this.clientId;
      }

      this.$router.push(route);
      this.$emit('filter', this.filter);
    },
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler(value) {
        if (!value) {
          return;
        }

        let isRefresh = false;

        if (!!value.search && this.filter.search !== value.search) {
          this.filter.search = value.search;
          isRefresh = !!this.filter.search;
        }

        if (!!value['time-period'] && this.filter.timePeriod !== parseInt(value['time-period'], 10)) {
          this.filter.timePeriod = parseInt(value['time-period'], 10);
          isRefresh = this.filter.timePeriod !== timePeriod.all;
        }

        if (!!value['task-type'] && this.filter.taskType !== parseInt(value['task-type'], 10)) {
          this.filter.taskType = parseInt(value['task-type'], 10);
          isRefresh = this.filter.taskType !== taskType.all;
        }

        if (!!value['settlement-type'] && this.filter.settlementType !== parseInt(value['settlement-type'], 10)) {
          this.filter.settlementType = parseInt(value['settlement-type'], 10);
          isRefresh = this.filter.settlementType !== settlementType.none;
        }

        if (!!value['start-date'] && this.filter.startDate !== value['start-date']) {
          this.filter.startDate = value['start-date'];
          isRefresh = !!this.filter.startDate;
        }

        if (!!value['stop-date'] && this.filter.stopDate !== value['stop-date']) {
          this.filter.stopDate = value['stop-date'];
          isRefresh = !!this.filter.stopDate;
        }

        if (isRefresh) {
          this.$emit('filter', this.filter);
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/assets/main.scss';

  .app-background {
    background-color: $app-background-color !important;
  }
</style>
