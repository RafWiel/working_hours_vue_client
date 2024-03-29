<template>
  <task-list-view-filter-layout>
    <!-- Search -->
    <template v-slot:search>
      <v-text-field
        @click.stop
        :label="$t('filter.search')"
        @keydown.enter.prevent
        @keyup.space.prevent
        @input="emitDelayedFilterEvent(true)"
        ref="search"
        prepend-inner-icon="mdi-magnify"
        type="input"
        clearable
        hide-details="auto"
        validate-on-blur
        v-model.lazy.trim="filter.search"/>
    </template>
    <!-- Time period -->
    <template v-slot:period>
      <v-select
        :disabled="!!filter.startDate || !!filter.stopDate"
        :items="timePeriodItems"
        :label="$t('filter.timePeriod')"
        @click.stop
        @change="emitFilterEvent"
        ref="timePeriod"
        v-model="filter.timePeriod"
        item-value="id"
        hide-details="auto"/>
    </template>
    <!-- Invoice -->
    <template v-slot:invoice>
      <v-select
        :items="invoiceTypeItems"
        :label="$t('filter.invoice')"
        @click.stop
        @change="emitFilterEvent"
        v-model="filter.invoiceType"
        item-value="id"
        hide-details="auto"/>
    </template>
    <!-- Settlement -->
    <template v-slot:settlement>
      <v-select
        :items="settlementTypeItems"
        :label="$t('filter.settlement')"
        @click.stop
        @change="emitFilterEvent"
        v-model="filter.settlementType"
        item-value="id"
        hide-details="auto"/>
    </template>
    <!-- Task type -->
    <template v-slot:taskType>
      <v-select
        :items="taskTypeItems"
        :disabled="!isAdministrator"
        :label="$t('filter.client')"
        @click.stop
        @change="emitFilterEvent"
        v-model="filter.taskType"
        item-value="id"
        hide-details="auto"/>
    </template>
    <!-- Start date -->
    <template v-slot:startDate>
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
            @click:clear="filter.startDate = 0; emitFilterEvent()"
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
          @change="emitFilterEvent"
          v-model="filter.startDate"
          no-title/>
      </v-menu>
    </template>
    <!-- End date -->
    <template v-slot:endDate>
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
            @click:clear="filter.stopDate = 0; emitFilterEvent()"
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
          @change="emitFilterEvent"
          v-model="filter.stopDate"
          no-title/>
      </v-menu>
    </template>
  </task-list-view-filter-layout>
</template>

<script>
import debounce from 'lodash.debounce';
import moment from 'moment';
import timePeriod from '@/enums/timePeriod';
import taskType from '@/enums/taskType';
import userType from '@/enums/userType';
import invoiceType from '@/enums/invoiceType';
import settlementType from '@/enums/settlementType';
import TaskListViewFilterLayout from './TaskListViewFilterLayout.vue';

export default {
  components: {
    TaskListViewFilterLayout,
  },
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
    invoiceTypeItems() {
      return invoiceType.getItems();
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
      timePeriod: timePeriod.all,
      startDate: null,
      stopDate: null,
      taskType: taskType.all,
      settlementType: settlementType.none,
      invoiceType: invoiceType.all,
    },
    isStartDatePickerVisible: false,
    isStopDatePickerVisible: false,
  }),
  mounted() {
    this.setUserTaskType();
    this.loadFromLocalStorage();
  },
  methods: {
    emitDelayedFilterEvent: debounce(function emit() {
      this.emitFilterEvent();
    }, 500),
    emitFilterEvent() {
      const route = {
        name: this.route,
        query: {
          sort: this.$route.query.sort,
          order: this.$route.query.order,
        },
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

      if (this.filter.invoiceType !== invoiceType.none) {
        route.query['invoice-type'] = this.filter.invoiceType;
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

      // console.log('before:', this.$route.query);
      // console.log('after', route.query);

      this.saveToLocalStorage();
      this.$router.replace(route);
      this.$emit('filter', this.filter);
    },
    // emitSortEvent(sorting) {
    //   this.$emit('sort', sorting);
    // },
    saveToLocalStorage() {
      localStorage.setItem(`${this.$route.name}Filter`, JSON.stringify(this.filter));
    },
    loadFromLocalStorage() {
      // // ignore if query contains data
      if (this.$route.query && Object.keys(this.$route.query).length !== 0) {
        return;
      }

      const filter = localStorage.getItem(`${this.$route.name}Filter`);
      if (filter) {
        this.filter = JSON.parse(filter);
        this.setUserTaskType();
        this.emitFilterEvent();

        return;
      }

      // unsettled by default
      if (!this.$route.query['settlement-type']) {
        this.filter.settlementType = settlementType.unsettled;
        this.emitFilterEvent();
      }
    },
    setUserTaskType() {
      if (this.$store && this.$store.state.userType === userType.dsf) {
        this.filter.taskType = taskType.priceBased;
      }

      if (this.$store && this.$store.state.userType === userType.ald) {
        this.filter.taskType = taskType.hoursBased;
      }

      if (this.clientId) {
        this.filter.taskType = taskType.priceBased;
      }
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
          this.filter.search = value.search.substring(0, 20);
          isRefresh = !!this.filter.search;
        }

        const timePeriodValue = parseInt(value['time-period'], 10);
        if (!!timePeriodValue
        && this.filter.timePeriod !== timePeriodValue
        && timePeriod.isValid(timePeriodValue)) {
          this.filter.timePeriod = timePeriodValue;
          isRefresh = this.filter.timePeriod !== timePeriod.all;
        }

        const taskTypeValue = parseInt(value['task-type'], 10);
        if (!!taskTypeValue
        && this.filter.taskType !== taskTypeValue
        && taskType.isValid(taskTypeValue)) {
          this.filter.taskType = taskTypeValue;
          isRefresh = this.filter.taskType !== taskType.all;
        }

        const settlementTypeValue = parseInt(value['settlement-type'], 10);
        if (!!settlementTypeValue
        && this.filter.settlementType !== settlementTypeValue
        && settlementType.isValid(settlementTypeValue)) {
          this.filter.settlementType = settlementTypeValue;
          isRefresh = this.filter.settlementType !== settlementType.none;
        }

        const invoiceTypeValue = parseInt(value['invoice-type'], 10);
        if (!!invoiceTypeValue
        && this.filter.invoiceType !== invoiceTypeValue
        && invoiceType.isValid(invoiceTypeValue)) {
          this.filter.invoiceType = invoiceTypeValue;
          isRefresh = this.filter.invoiceType !== invoiceType.none;
        }

        const startDate = value['start-date'];
        if (!!startDate
        && this.filter.startDate !== startDate
        && moment(startDate, 'YYYY-MM-DD', true).isValid()) {
          this.filter.startDate = startDate;
          isRefresh = true;
        }

        const stopDate = value['stop-date'];
        if (!!stopDate
        && this.filter.stopDate !== stopDate
        && moment(stopDate, 'YYYY-MM-DD', true).isValid()) {
          this.filter.stopDate = stopDate;
          isRefresh = true;
        }

        if (isRefresh) {
          this.saveToLocalStorage();
          this.$emit('filter', this.filter);
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/assets/main.scss';
</style>
