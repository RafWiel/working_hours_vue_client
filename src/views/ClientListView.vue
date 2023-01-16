<template>
  <v-container
    :style="$vuetify.breakpoint.xs ? 'min-height: calc(100vh - 48px)' : ''"
    class="pa-0 d-flex flex-column flex-nowrap"
    fluid>
    <!-- Filter -->
    <client-list-view-filter
      :class="$vuetify.breakpoint.mdAndUp ? 'px-4 pt-2 pb-2' : 'px-3 py-2'"
      @filter="filterItems"
      route="clients"/>
    <!-- Portrait sorting -->
    <portrait-sorting
      :columns="portraitColumns"
      @sort="sortItems"
      ref="portrait-sorting"
      v-if="$vuetify.breakpoint.xs"
      class="px-3 pt-2"/>
    <!-- DataGrid -->
    <data-grid
      :columns="columns"
      :items="items"
      :portraitCols="4"
      :isSummary="true"
      @sort="sortItems"
      ref="datagrid"/>
    <div
      v-if="items.length"
      v-intersect.quiet="intersect"
      style="height:1px; width:1px;"/>
  </v-container>
</template>

<script>
import DataGrid from '@/components/common/DataGrid.vue';
import moment from 'moment';
import logger from '@/misc/logger';
import clientsService from '@/services/clients';
import sortOrder from '@/enums/sortOrder';
import PortraitSorting from '@/components/PortraitSorting.vue';
import ClientListViewFilter from '@/components/ClientListViewFilter.vue';
import taskType from '@/enums/taskType';
import timePeriod from '@/enums/timePeriod';
import settlementType from '@/enums/settlementType';

export default {
  name: 'ClientListView',
  components: {
    DataGrid,
    PortraitSorting,
    ClientListViewFilter,
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
        id: 0,
        text: 'Klient',
        value: 'client',
        limitedWidth: 15,
        fullWidth: 15,
      },
      {
        id: 1,
        text: 'Kwota',
        value: 'amount',
        limitedWidth: 14,
        fullWidth: 12,
        isSum: true,
        sum: 0,
        decimalDigits: 2,
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
      clientsService.get({
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
        response.data.clients.forEach((item) => {
          this.items.push(item);
        });

        this.calculateSum();

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
    calculateSum() {
      this.columns.filter((u) => u.isSum)
      .forEach((item) => {
        const column = item;
        const items = this.items.filter((u) => u[column.value]);

        column.sum = items.reduce((part, u) => part + parseFloat(u[column.value]), 0);

        if (column.decimalDigits) {
          column.sum = column.sum.toFixed(column.decimalDigits);
        }
      });
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
