<template>
  <v-container
    :style="$vuetify.breakpoint.xs ? 'min-height: calc(100vh - 48px)' : ''"
    class="pa-0 d-flex flex-column flex-nowrap"
    fluid>
    <!-- Filter -->
    <client-list-view-filter
      :class="$vuetify.breakpoint.mdAndUp ? 'px-4 pt-2 pb-2' : 'px-3 py-2'"
      :portraitColumns="portraitColumns"
      @filter="filterItems"
      @sort="sortItems"
      route="clients"/>
    <!-- DataGrid -->
    <data-grid
      :columns="columns"
      :items="items"
      :portraitCols="4"
      :isSummary="true"
      @sort="sortItems"
      @itemClick="navigate"
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
import logger from '@/plugins/logger';
import clientsService from '@/services/clients';
import sortOrder from '@/enums/sortOrder';
import ClientListViewFilter from '@/components/ClientListViewFilter.vue';
import taskType from '@/enums/taskType';
import timePeriod from '@/enums/timePeriod';
import settlementType from '@/enums/settlementType';

export default {
  name: 'ClientListView',
  components: {
    DataGrid,
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
    page: 1,
    items: [],
    columns: [
      {
        id: 0,
        value: 'client',
        limitedWidth: 15,
        fullWidth: 15,
      },
      {
        id: 1,
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
  mounted() {
    this.updateAppTitle();

    this.$root.$on('updateLocalization', () => {
      this.updateAppTitle();
    });

    // prevent double fetch on page refresh by user
    if (this.$route.query && Object.keys(this.$route.query).length !== 0) {
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

        // console.log('fetch: ', this.page);
        // console.log('items: ', this.items.length);
        // console.log(response.data);

        // format values
        response.data.clients.forEach((item) => {
          this.items.push(item);
        });

        this.calculateSum();

        // increment page number for next fetch
        this.page += 1;
      })
      .catch((error) => this.processError('fetch', error));

      this.$emit('isProcessing', false);
    },
    intersect(entries, observer, isIntersecting) {
      if (!isIntersecting) {
        return;
      }

      this.fetch();
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
      this.$emit('showMessage', this.$t('clientListView.title'), message);
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
    navigate(id) {
      //console.log('filter: ', this.filter.settlementType);
      this.$router.push({ name: 'tasks',
        query: {
          'client-id': id,
          'settlement-type': this.filter ? this.filter.settlementType : settlementType.all,
        },
      });
    },
    updateAppTitle() {
      this.$root.$emit('updateAppTitle', this.$t('clientListView.title'));
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
