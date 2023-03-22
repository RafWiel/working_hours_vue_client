<template>
  <v-container
    :style="$vuetify.breakpoint.xs ? 'min-height: calc(100vh - 48px)' : ''"
    class="pa-0 d-flex flex-column flex-nowrap"
    fluid>
    <!-- Filter -->
    <task-list-view-filter
      :class="$vuetify.breakpoint.mdAndUp ? 'px-4 pt-2 pb-2' : 'px-3 py-2'"
      :clientId="client.id"
      @filter="filterItems"
      :route="$route.name"/>
    <!-- DataGrid -->
    <data-grid
      :columns="columns"
      :items="items"
      :isSelectionCheckbox="isSettlement"
      :isSummary="true"
      @selectAll="selectAllItems"
      @selectionChanged="notifySelection"
      @sort="sortItems"
      @itemClick="navigate"
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
import debounce from 'lodash.debounce';
import moment from 'moment';
import logger from '@/plugins/logger';
import tasksService from '@/services/tasks';
import DatePickerDialog from '@/components/DatePickerDialog.vue';
import sortOrder from '@/enums/sortOrder';
import TaskListViewFilter from '@/components/TaskListViewFilter.vue';
import taskType from '@/enums/taskType';
import timePeriod from '@/enums/timePeriod';
import userType from '@/enums/userType';
import settlementType from '@/enums/settlementType';
import invoiceType from '@/enums/invoiceType';

export default {
  name: 'TaskListView',
  components: {
    DataGrid,
    DatePickerDialog,
    TaskListViewFilter,
  },
  computed: {
    isSelection() {
      return this.items.filter((u) => u.isSelected).length > 0;
    },
    isSettlement() {
      return this.$store && (
        this.$store.state.userType === userType.administrator
        || this.$store.state.userType === userType.dsf);
    },
  },
  data: () => ({
    page: 1,
    items: [],
    columns: [
      {
        id: 0,
        value: 'name',
        width: {
          xl: null,
          md: null,
          sm: null,
          xs: 60,
        },
      },
      {
        id: 1,
        value: 'creationDate',
        width: {
          xl: 12,
          md: 13,
          sm: 19,
          xs: null,
        },
      },
      {
        id: 2,
        value: 'client',
        width: {
          xl: 13,
          md: 16,
          sm: 15,
          xs: null,
        },
        hidden: userType.ald,
      },
      {
        id: 3,
        value: 'project',
        width: {
          xl: 20,
          md: 30,
          sm: 26,
          xs: null,
        },
      },
      {
        id: 4,
        value: 'version',
        width: {
          xl: 12,
          md: 7,
          sm: 11,
          xs: null,
        },
      },
      {
        id: 5,
        value: 'price',
        isSum: true,
        sum: 0,
        decimalDigits: 0,
        isVisible: false,
        width: {
          xl: 10,
          md: 7,
          sm: 11,
          xs: 17,
        },
      },
      {
        id: 6,
        value: 'hours',
        isSum: true,
        sum: 0,
        decimalDigits: 0,
        isVisible: true,
        width: {
          xl: 10,
          md: 7,
          sm: 12,
          xs: 13,
        },
      },
      {
        id: 7,
        value: 'invoiceDate',
        width: {
          xl: 10,
          md: 8,
          sm: null,
          xs: null,
        },
      },
      {
        id: 8,
        value: 'settlementDate',
        width: {
          xl: 10,
          md: 8,
          sm: null,
          xs: null,
        },
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
    client: {
      id: null,
      name: null,
    },
  }),
  created() {
    // console.log('created ', this.$route.name);
    this.client.id = this.$route.query && this.$route.query['client-id'] ? parseInt(this.$route.query['client-id'], 10) : null;
  },
  mounted() {
    this.updateAppTitle();

    this.$root.$on('updateLocalization', () => {
      this.updateAppTitle(this.client.name);
    });

    this.$root.$on('settleTasks', () => {
      this.showDatePickerDialog();
    });

    this.$route.meta.isBackButton = !!this.client.id;

    this.beginFetch();
  },
  methods: {
    async fetch() {
      // set loading icon
      this.$emit('isProcessing', true);

      let taskTypeFilter = null;

      switch (this.$store.state.userType) {
        case userType.ald:
          taskTypeFilter = taskType.hoursBased;
          break;
        case userType.dsf:
          taskTypeFilter = taskType.priceBased;
          break;
        default:
          taskTypeFilter = this.filter && this.filter.taskType !== taskType.all ? this.filter.taskType : null;
      }

      // get items
      tasksService.get({
        page: this.page,
        'sort-column': this.sorting.column !== null ? this.sorting.column : null,
        'sort-order': this.sorting.column !== null ? this.sorting.order : null,
        search: this.filter && this.filter.search ? this.filter.search : null,
        'start-date': this.filter && this.filter.startDate ? moment(this.filter.startDate).utc().format('YYYY-MM-DD HH:mm:ss.SSS Z') : null,
        'stop-date': this.filter && this.filter.stopDate ? moment(this.filter.stopDate).add(1, 'd').utc().format('YYYY-MM-DD HH:mm:ss.SSS Z') : null,
        'time-period': this.filter && this.filter.timePeriod !== timePeriod.all ? this.filter.timePeriod : null,
        'task-type': taskTypeFilter,
        'settlement-type': this.filter && this.filter.settlementType > settlementType.all ? this.filter.settlementType : null,
        'invoice-type': this.filter && this.filter.invoiceType > invoiceType.all ? this.filter.invoiceType : null,
        'client-id': this.client.id,
      })
      .then((response) => {
        if (!response.data) return;

        const { client, tasks } = response.data;

        // console.log('fetch: ', this.page);
        // console.log('items: ', this.items.length);
        // console.log(response.data);

        if (client) {
          this.updateAppTitle(client);
        }

        const isAdmin = this.$store.state.userType === userType.administrator;
        const isDsf = this.$store.state.userType === userType.dsf;

        // format values
        tasks.forEach((task) => {
          const item = task;
          item.isSelected = false;
          item.isSelectionDisabled = (isAdmin && !!item.settlementDate) || (isDsf && !!item.invoiceDate);
          item.creationDate = moment(item.creationDate, 'YYYY-MM-DD hh:mm:ss.SSS Z').format('YYYY-MM-DD');
          item.settlementDate = item.settlementDate !== null ? moment(item.settlementDate, 'YYYY-MM-DD hh:mm:ss.SSS Z').format('YYYY-MM-DD') : '';
          item.invoiceDate = item.invoiceDate !== null ? moment(item.invoiceDate, 'YYYY-MM-DD hh:mm:ss.SSS Z').format('YYYY-MM-DD') : '';
          item.name = `${item.client ? item.client : ''} ${item.project} ${item.version}`;

          this.items.push(item);
        });

        this.calculateSum();

        // increment page number for next fetch
        this.page += 1;
      })
      .catch((error) => this.processError('fetch', error));

      this.$emit('isProcessing', false);
    },
    beginFetch: debounce(function fetch() {
      // called 3 times on reload, run only once
      this.fetch();
    }, 50),
    intersect(entries, observer, isIntersecting) {
      if (!isIntersecting) {
        return;
      }

      //console.log('intersect');
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
      this.$emit('showMessage', this.$t('taskListView.title'), message);
    },
    showAutoMessage(message) {
      this.$emit('showAutoMessage', this.$t('taskListView.title'), message);
    },
    selectAllItems(value) {
      const isAdmin = this.$store.state.userType === userType.administrator;
      const isDsf = this.$store.state.userType === userType.dsf;

      this.items.forEach((task) => {
        const item = task;

        if (isAdmin && !!item.settlementDate === false) {
          item.isSelected = value;
        }

        if (isDsf && !!item.invoiceDate === false) {
          item.isSelected = value;
        }
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

        let response = null;
        const isAdmin = this.$store.state.userType === userType.administrator;
        const isDsf = this.$store.state.userType === userType.dsf;

        if (isAdmin) {
          response = await tasksService.settle({
            idArray,
            settlementDate: date,
          });
        }

        if (isDsf) {
          response = await tasksService.invoice({
            idArray,
            invoiceDate: date,
          });
        }

        if (response.status === 200) {
          this.$emit('isProcessing', false);

          this.showAutoMessage(this.$tc('message.taskSettledPlural', idArray.length));

          // refresh
          this.page = 1;
          this.items = [];
          this.fetch();
          this.notifySelection();

          return;
        }

        this.showMessage(this.$t('message.settlementFailed'));
      }
      catch (error) {
        this.processError('settleTasks', error);
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

      if (this.sorting.column === 'name') {
        this.sorting.column = 'project';
      }

      // refresh with new sorting
      this.beginFetch();
    },
    filterItems(filter) {
      // reset items
      this.items = [];
      this.page = 1;
      this.filter = filter;

      this.hidePriceHoursColumns();

      // refresh with new filter
      this.beginFetch();
    },
    calculateSum() {
      this.columns.filter((u) => u.isSum)
      .forEach((item) => {
        const column = item;
        const items = this.items.filter((u) => u[column.value]);

        column.sum = items.reduce((part, u) => part + parseFloat(u[column.value]), 0);
      });
    },
    navigate(id) {
      this.$router.push({
        name: 'task',
        params: { id },
      });
    },
    updateAppTitle(client) {
      let title = client ? this.$t('taskListView.titleClient', { client }) : this.$t('taskListView.title');
      if (!client) {
        if (this.$route.name === 'tasksAd') {
          const name = this.$t('common.ald');
          title = this.$t('taskListView.titleName', { name });
        }

        if (this.$route.name === 'tasksDs') {
          const name = this.$t('common.dsf');
          title = this.$t('taskListView.titleName', { name });
        }
      }

      this.client.name = client;
      this.$root.$emit('updateAppTitle', title);
    },
    hidePriceHoursColumns() {
      const nameColumn = this.columns.find((u) => u.value === 'name');
      const priceColumn = this.columns.find((u) => u.value === 'price');
      const hoursColumn = this.columns.find((u) => u.value === 'hours');
      const isSettlement = this.$store && (
          this.$store.state.userType === userType.administrator
          || this.$store.state.userType === userType.dsf);

      if (this.client.id) {
        this.filter.taskType = taskType.priceBased;
      }

      switch (this.filter.taskType) {
        case taskType.priceBased:
          priceColumn.isVisible = true;
          nameColumn.width.xs = isSettlement ? 70 : 80; // checkbox in admin mode
          priceColumn.width.xs = 20;
          hoursColumn.isVisible = false;
          break;
        case taskType.hoursBased:
          priceColumn.isVisible = false;
          hoursColumn.isVisible = true;
          nameColumn.width.xs = isSettlement ? 73 : 78; // checkbox in admin mode
          hoursColumn.width.xs = isSettlement ? 17 : 22; // checkbox in admin mode
          break;
        default:
          priceColumn.isVisible = true;
          hoursColumn.isVisible = true;
          nameColumn.width.xs = 60;
          priceColumn.width.xs = 17;
          hoursColumn.width.xs = 13;
      }
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
