<template>
  <v-container
    :class="$vuetify.breakpoint.smAndUp ? 'my-4' : ''"
    :style="$vuetify.breakpoint.xs ? 'min-height: calc(100vh - 48px)' : ''"
    class="pa-0 d-flex flex-column flex-nowrap "
    fluid>

    <v-row class="no-gutters grow mx-4">
      <v-col>
      <data-grid
        :columns="columns"
        :items="items"
        :portraitCols="4"/>
        </v-col>
    </v-row>

  </v-container>
</template>

<script>
import DataGrid from '@/components/common/DataGrid.vue';
//import debounce from 'lodash.debounce';
//import moment from 'moment';
//import rules from '@/misc/rules';
import logger from '@/misc/logger';
//import tasksService from '@/services/tasks';
//import clientsService from '@/services/clients';
//import projectsService from '@/services/projects';
//import taskType from '@/enums/taskType';

export default {
  name: 'TaskListView',
  components: {
    DataGrid,
  },
  data: () => ({
    messageTitle: 'Lista zadań',
    page: 1,
    items: [],
    columns: [
      {
        id: 0,
        text: 'Data',
        value: 'date',
        limitedWidth: 20,
        fullWidth: 15,
      },
      {
        id: 1,
        text: 'Klient',
        value: 'client',
        limitedWidth: 14,
        fullWidth: 15,
      },
      {
        id: 2,
        text: 'Projekt',
        value: 'project',
        limitedWidth: 26,
        fullWidth: 15,
      },
      {
        id: 3,
        text: 'Wersja',
        value: 'version',
        limitedWidth: 20,
        fullWidth: 15,
      },
      {
        id: 4,
        text: 'Cena',
        value: 'price',
        fullWidth: 15,
      },
      {
        id: 5,
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
    this.fetch();
  },
  methods: {
    fetch() {
      // set loading icon
      this.$emit('isProcessing', true);

      // get items
      tasksService.get({ page: this.page })
      .then((response) => {
        if (!response.data) return;
        console.log(response.data);
        this.newestItem = response.data;

        // copy project and version
        this.item.client = this.newestItem.client;
        this.item.project = this.newestItem.project;
        this.item.version = this.newestItem.version;
      })
      .catch((error) => this.processError(error));

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
