<template>
  <v-container fluid class="pa-0">
    <v-row class="no-gutters">
      <!-- Kolumna -->
      <v-col
        cols="6">
        <v-select
          :items="columns"
          @click.stop
          @change="emitEvent"
          v-model="sorting.column"
          ref="column"
          item-text="text"
          item-value="value"
          hide-details="auto"
          clearable
          label="Sortowanie"/>
      </v-col>
      <!-- Kolejnosc -->
      <v-col
        cols="6"
        class="pl-2">
        <v-select
          :items="orders"
          @click.stop
          @change="emitEvent"
          v-model="sorting.order"
          ref="order"
          item-text="value"
          item-value="id"
          hide-details="auto"
          label="Kolejność"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import sortOrder from '@/enums/sortOrder';

export default {
  name: 'PortraitSorting',
  props: { columns: Array },
  data: () => ({
    sorting: {
      column: null,
      order: 0,
    },
    orders: [
      { id: 0, value: 'Rosnąco' },
      { id: 1, value: 'Malejąco' },
    ],
    sortOrderItems: sortOrder.items,
  }),
  methods: {
    emitEvent() {
      this.$emit('sort', this.sorting);
    },
  },
};
</script>
