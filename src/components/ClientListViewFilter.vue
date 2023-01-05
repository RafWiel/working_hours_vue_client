<template>
  <v-container fluid class="pa-0 mr-4">
    <v-row class="no-gutters">
      <!-- Szukaj -->
      <v-col
        cols="6"
        sm="9"
        lg="10">
        <v-text-field
        @click.stop
          @keydown.enter.prevent
          @keyup.space.prevent
          @input="emitDelayedEvent(true)"
          ref="search"
          label="Szukaj"
          prepend-inner-icon="mdi-magnify"
          type="input"
          clearable
          hide-details="auto"
          validate-on-blur
          v-model.lazy.trim="filter.search"/>
      </v-col>
      <!-- Rozliczenie -->
      <v-col
        class="pl-2"
        cols="6"
        sm="3"
        lg="2">
        <v-select
          :items="settlementTypeItems"
          @click.stop
          @change="emitEvent"
          v-model="filter.settlementType"
          item-value="id"
          hide-details="auto"
          label="Rozliczenie"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import debounce from 'lodash.debounce'; // debounce - opoznienie
import timePeriod from '@/enums/timePeriod';
import taskType from '@/enums/taskType';
import settlementType from '@/enums/settlementType';

export default {
  name: 'ClientListViewFilter',
  props: { route: String },
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
    timePeriodItems: timePeriod.items,
    taskTypeItems: taskType.items,
    settlementTypeItems: settlementType.items,
  }),
  watch: {
    '$route.query': {
      immediate: true,
      handler(value) {
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
           isRefresh = this.filter.settlementType !== settlementType.all;
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

      if (this.filter.settlementType !== settlementType.all) {
        route.query['settlement-type'] = this.filter.settlementType;
      }

      if (this.filter.startDate) {
        route.query['start-date'] = this.filter.startDate;
      }

      if (this.filter.stopDate) {
        route.query['stop-date'] = this.filter.stopDate;
      }

      this.$router.push(route);
      this.$emit('filter', this.filter);
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
