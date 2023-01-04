<template>
  <v-container
    :style="$vuetify.breakpoint.xs ? 'min-height: calc(100vh - 48px)' : ''"
    class="pa-0 d-flex flex-column flex-nowrap"
    fluid>
    <!-- Filter -->
    <list-view-filter
      :class="$vuetify.breakpoint.mdAndUp ? 'px-4 pt-2 pb-2' : 'px-3 py-2'"
      @filter="filterItems"/>
    <!-- Portrait sorting -->
    <portrait-sorting
      :columns="portraitColumns"
      @sort="sortItems"
      ref="portrait-sorting"
      v-if="$vuetify.breakpoint.xs"
      class="pl-3 pt-2 pr-13"/>
    <!-- DataGrid -->
    <data-grid
      :columns="columns"
      :items="items"
      :portraitCols="4"
      :isSelectionCheckbox="true"
      @selectAll="selectAllItems"
      @selectionChanged="notifySelection"
      @sort="sortItems"
      ref="datagrid"/>
    <div
      v-if="items.length"
      v-intersect.quiet="intersect"
      style="height:1px; width:1px;"/>
    <!-- Date picker -->
    <v-row justify="center" class="no-gutters">
      <date-picker-dialog
        :isVisible="datePickerDialog.isVisible"
        :hideRequest="hideDatePickerDialog"
        @apply="settleTasks"/>
    </v-row>
  </v-container>
</template>

<script>
import DataGrid from '@/components/common/DataGrid.vue';
import moment from 'moment';
import logger from '@/misc/logger';
import tasksService from '@/services/tasks';
import DatePickerDialog from '@/components/DatePickerDialog.vue';
import sortOrder from '@/enums/sortOrder';
import PortraitSorting from '@/components/PortraitSorting.vue';
import ListViewFilter from '@/components/ListViewFilter.vue';
import taskType from '@/enums/taskType';
import timePeriod from '@/enums/timePeriod';
import settlementType from '@/enums/settlementType';

export default {
  name: 'TaskListView',
  components: {
    DataGrid,
    DatePickerDialog,
    PortraitSorting,
    ListViewFilter,
  },
  computed: {
    isSelection() {
      return this.items.filter((u) => u.isSelected).length > 0;
    },
    portraitColumns() {
      // filter headers for mobile portrait view
      return this.columns.filter((item) => item.limitedWidth !== undefined);
    },
  },
  data: () => ({
    messageTitle: 'Lista zadań',
    page: 1,
    items: [],
    columns: [
      {
        id: 1,
        text: 'Data',
        value: 'creationDate',
        limitedWidth: 15,
        fullWidth: 15,
      },
      {
        id: 2,
        text: 'Klient',
        value: 'client',
        limitedWidth: 15,
        fullWidth: 15,
      },
      {
        id: 3,
        text: 'Projekt',
        value: 'project',
        limitedWidth: 15,
        fullWidth: 15,
      },
      {
        id: 4,
        text: 'Wersja',
        value: 'version',
        limitedWidth: 10,
        fullWidth: 12,
      },
      {
        id: 5,
        text: 'Cena',
        value: 'price',
        limitedWidth: 14,
        fullWidth: 12,
      },
      {
        id: 6,
        text: 'Ilość godzin',
        value: 'hours',
        limitedWidth: 14,
        fullWidth: 12,
      },
      {
        id: 7,
        text: 'Rozliczenie',
        value: 'settlementDate',
        limitedWidth: 13,
        fullWidth: 15,
      },
    ],
    datePickerDialog: {
      isVisible: false,
    },
    sorting: {
      column: null,
      order: sortOrder.ascending,
    },
    filter: null,
  }),
  created() {
  },
  mounted() {
    this.$root.$on('settleTasks', () => {
      this.showDatePickerDialog();
    });

    // prevent double fetch on page refresh by user
    if (Object.keys(this.$route.query).length !== 0) {
      return;
    }

    this.fetch();
  },
  methods: {
    async fetch() {
      // set loading icon
      this.$emit('isProcessing', true);

      // get items
      tasksService.get({
        page: this.page,
        'sort-column': this.sorting.column !== null ? this.sorting.column : null,
        'sort-order': this.sorting.column !== null ? this.sorting.order : null,
        search: this.filter && this.filter.search ? this.filter.search : null,
        'start-date': this.filter && this.filter.startDate ? moment(this.filter.startDate).utc().format('YYYY-MM-DD HH:mm:ss.SSS Z') : null,
        'stop-date': this.filter && this.filter.stopDate ? moment(this.filter.stopDate).add(1, 'd').utc().format('YYYY-MM-DD HH:mm:ss.SSS Z') : null,
        'time-period': this.filter && this.filter.timePeriod !== timePeriod.all ? this.filter.timePeriod : null,
        'task-type': this.filter && this.filter.taskType !== taskType.all ? this.filter.taskType : null,
        'settlement-type': this.filter && this.filter.settlementType !== settlementType.all ? this.filter.settlementType : null,
      })
      .then((response) => {
        if (!response.data) return;

        console.log('fetch: ', this.page);
        console.log('items: ', this.items.length);
        console.log(response.data);

        // format values
        response.data.tasks.forEach((task) => {
          const item = task;
          item.isSelected = false;
          item.creationDate = moment(item.creationDate, 'YYYY-MM-DD hh:mm:ss.SSS Z').format('YYYY-MM-DD');
          item.settlementDate = item.settlementDate !== null ? moment(item.settlementDate, 'YYYY-MM-DD hh:mm:ss.SSS Z').format('YYYY-MM-DD') : '';

          this.items.push(item);
        });

        // increment page number for next fetch
        this.page += 1;
      })
      .catch((error) => this.processError(error));

      this.$emit('isProcessing', false);
    },
    intersect(entries, observer, isIntersecting) {
      if (!isIntersecting) {
        return;
      }

      console.log('intersect');
      this.fetch();
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
    selectAllItems(value) {
      this.items.forEach((task) => {
        const item = task;

        item.isSelected = value;
      });
      this.notifySelection();
    },
    async settleTasks(date) {
      try {
        this.$emit('isProcessing', true);

        const idArray = this.items.filter((u) => u.isSelected).map((u) => u.id);
        if (idArray.length === 0) {
          this.$emit('isProcessing', false);
          return;
        }

        const response = await tasksService.settle({
          idArray,
          settlementDate: date,
        });

        if (response.status === 200) {
          this.$emit('isProcessing', false);
          this.$emit('showMessage', this.messageTitle, `${idArray.length === 1 ? 'Zadanie' : 'Zadania'} rozliczone`);

          // refresh
          this.page = 1;
          this.items = [];
          this.fetch();
          this.notifySelection();

          return;
        }

        this.$emit('showMessage', this.messageTitle, 'Nieudane rozliczenie');
      }
      catch (error) {
        this.processError(error);
      }

      this.$emit('isProcessing', false);
    },
    notifySelection() {
      this.$root.$emit('selectionChanged', this.isSelection);
    },
    showDatePickerDialog() {
      this.datePickerDialog.isVisible = true;
    },
    hideDatePickerDialog() {
      this.datePickerDialog.isVisible = false;
    },
    sortItems(sorting) {
      this.items = [];
      this.page = 1;
      this.sorting.column = sorting.column;
      this.sorting.order = sorting.order;

      // refresh with new sorting
      this.fetch();
    },
    filterItems(filter) {
      // reset items
      this.items = [];
      this.page = 1;
      this.filter = filter;

      // refresh with new filter
      this.fetch();
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
