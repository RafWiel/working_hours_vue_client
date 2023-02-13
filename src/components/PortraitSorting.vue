<template>
  <v-container fluid class="pa-0">
    <v-row class="no-gutters">
      <!-- Kolumna -->
      <v-col
        cols="6">
        <v-select
          :items="columns"
          :label="$t('sorting.sorting')"
          @click.stop
          @change="emitEvent"
          v-model="sorting.column"
          ref="column"
          item-text="text"
          item-value="value"
          hide-details="auto"
          clearable/>
      </v-col>
      <!-- Kolejnosc -->
      <v-col
        cols="6"
        class="pl-2">
        <v-select
          :items="order"
          :label="$t('sorting.order')"
          @click.stop
          @change="emitEvent"
          v-model="sorting.order"
          ref="order"
          item-text="value"
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
    order() {
      return [
        { id: 0, value: this.$t('sorting.ascending') },
        { id: 1, value: this.$t('sorting.descending') },
      ];
    },
  },
  data: () => ({
    sorting: {
      column: null,
      order: 0,
    },
    sortOrderItems: sortOrder.items,
  }),
  methods: {
    emitEvent() {
      this.$emit('sort', this.sorting);
    },
  },
};
</script>
