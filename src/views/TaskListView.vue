<template>
  <v-container
    :style="$vuetify.breakpoint.xs ? 'min-height: calc(100vh - 48px)' : ''"
    class="pa-0 d-flex flex-column flex-nowrap"
    fluid>
    <v-row class="no-gutters grow">
      <v-col>
        <data-grid
          :columns="columns"
          :items="items"
          :portraitCols="4"
          :isSelectionCheckbox="true"
          @selectAll="selectAllItems"
          @selectionChanged="notifySelection"
          ref="datagrid"/>
      </v-col>
    </v-row>
    <div
      v-if="items.length"
      v-intersect.quiet="intersect"
      style="height:1px; width:1px;"/>
  </v-container>
</template>

<script>
import DataGrid from '@/components/common/DataGrid.vue';
//import debounce from 'lodash.debounce';
import moment from 'moment';
import logger from '@/misc/logger';
import tasksService from '@/services/tasks';
//import clientsService from '@/services/clients';
//import projectsService from '@/services/projects';
//import taskType from '@/enums/taskType';

export default {
  name: 'TaskListView',
  components: {
    DataGrid,
  },
  computed: {
    isSelection() {
      return this.items.filter((u) => u.isSelected).length > 0;
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
        limitedWidth: 20,
        fullWidth: 15,
      },
      {
        id: 2,
        text: 'Klient',
        value: 'client',
        limitedWidth: 14,
        fullWidth: 15,
      },
      {
        id: 3,
        text: 'Projekt',
        value: 'project',
        limitedWidth: 26,
        fullWidth: 15,
      },
      {
        id: 4,
        text: 'Wersja',
        value: 'version',
        limitedWidth: 20,
        fullWidth: 15,
      },
      {
        id: 5,
        text: 'Cena',
        value: 'price',
        fullWidth: 15,
      },
      {
        id: 6,
        text: 'Ilość godzin',
        value: 'hours',
        limitedWidth: 14,
        fullWidth: 15,
      },
    ],
  }),
  created() {
  },
  mounted() {
    this.$root.$on('settleTasks', () => {
      this.settleTasks();
    });

    this.fetch();
  },
  methods: {
    async fetch() {
      // set loading icon
      this.$emit('isProcessing', true);

      // get items
      tasksService.get({ page: this.page })
      .then((response) => {
        if (!response.data) return;

        console.log('fetch: ', this.page);
        console.log(response.data);

        // format values
        response.data.tasks.forEach((task) => {
          const item = task;
          item.isSelected = false;
          item.creationDate = moment(item.creationDate, 'YYYY-MM-DD hh:mm:ss.SSS Z').format('YYYY-MM-DD');
          //item.requestType = requestType.getText(item.requestType);
          //item.submitType = requestSubmitType.getText(item.submitType);
          //item.status = requestStatus.getText(item.status, this.$vuetify.breakpoint.xs);
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
    async settleTasks() {
      try {
        this.$emit('isProcessing', true);

        const idArray = this.items.filter((u) => u.isSelected).map((u) => u.id);
        if (idArray.length === 0) {
          this.$emit('isProcessing', false);
          return;
        }

        const settlementDate = '2022-12-29';

        const response = await tasksService.settle({
          idArray,
          settlementDate,
        });

        if (response.status === 200) {
          this.$emit('isProcessing', false);
          this.$emit('showMessage', this.messageTitle, `${idArray.length === 1 ? 'Zadanie' : 'Zadania'} rozliczone`);

          // refresh
          this.page = 1;
          this.items = [];
          this.fetch();

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
