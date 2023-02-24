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
      order: 0,
    },
  }),
  methods: {
    emitEvent() {
      this.$emit('sort', this.sorting);
    },
  },
};
</script>
