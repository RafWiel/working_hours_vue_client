<template>
  <v-container fluid class="pa-0">
    <v-row class="no-gutters">
      <!-- Kolumna -->
      <v-col
        cols="6">
        <v-select
          :items="translatedColumns"
          :label="$t('sorting.sorting')"
          @click.stop
          @change="emitEvent"
          v-model="sorting.column"
          ref="column"
          item-text="text"
          item-value="id"
          hide-details="auto"
          clearable/>
      </v-col>
      <!-- Kolejnosc -->
      <v-col
        cols="6"
        class="pl-2">
        <v-select
          :items="sortOrderItems"
          :label="$t('sorting.order')"
          @click.stop
          @change="emitEvent"
          v-model="sorting.order"
          ref="order"
          item-text="text"
          item-value="id"
          hide-details="auto"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import sortOrder from '@/enums/sortOrder';

export default {
  name: 'PortraitSorting',
  props: { columns: Array },
  computed: {
    translatedColumns() {
      const columns = [];
      this.columns.forEach((column) => {
        columns.push({
          id: column.value,
          text: this.$t(`dataGridColumns.${column.value}`),
        });
      });

      return columns;
    },
    sortOrderItems() {
      return sortOrder.getItems();
    },
  },
  data: () => ({
    sorting: {
      column: null,
      order: sortOrder.ascending,
    },
  }),
  mounted() {
    this.loadFromLocalStorage();
  },
  methods: {
    emitEvent() {
      const route = {
        name: this.route,
        query: JSON.parse(JSON.stringify(this.$route.query)),
      };

      route.query.sort = this.sorting.column ? this.sorting.column : null;
      route.query.order = this.sorting.column ? this.sorting.order : null;

      this.saveToLocalStorage();
      this.$router.replace(route);
      this.$emit('sort', this.sorting);
    },
    saveToLocalStorage() {
      localStorage.setItem(`${this.$route.name}Sorting`, JSON.stringify(this.sorting));
    },
    loadFromLocalStorage() {
      // // ignore if query contains data
      if (this.$route.query && Object.keys(this.$route.query).length !== 0) {
        return;
      }

      const sorting = localStorage.getItem(`${this.$route.name}Sorting`);
      if (sorting) {
        this.sorting = JSON.parse(sorting);
        this.emitEvent();
      }

      console.log(localStorage.getItem(`${this.$route.name}Sorting`));
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

        if (!!value.sort && this.sorting.column !== value.sort) {
          this.sorting.column = value.sort;
          isRefresh = !!this.sorting.column;
        }

        if (!!value.order && this.sorting.order !== parseInt(value.order, 10)) {
          this.sorting.order = parseInt(value.order, 10);
          isRefresh = true;
        }

        if (isRefresh) {
          this.saveToLocalStorage();
          this.$emit('sort', this.sorting);
        }
      },
    },
  },
};
</script>
