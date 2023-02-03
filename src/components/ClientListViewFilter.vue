<template>
  <v-container fluid class="pa-0 mr-4">
    <v-row class="no-gutters">
      <!-- Szukaj -->
      <v-col
        cols="6"
        sm="9"
        lg="10">
        <v-text-field
        @click.stop
          @keydown.enter.prevent
          @keyup.space.prevent
          @input="emitDelayedEvent(true)"
          ref="search"
          label="Szukaj"
          prepend-inner-icon="mdi-magnify"
          type="input"
          clearable
          hide-details="auto"
          validate-on-blur
          v-model.lazy.trim="filter.search"/>
      </v-col>
      <!-- Rozliczenie -->
      <v-col
        class="pl-2"
        cols="6"
        sm="3"
        lg="2">
        <v-select
          :items="settlementTypeItems"
          @click.stop
          @change="emitEvent"
          v-model="filter.settlementType"
          item-value="id"
          hide-details="auto"
          label="Rozliczenie"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import debounce from 'lodash.debounce'; // debounce - opoznienie
import settlementType from '@/enums/settlementType';

export default {
  name: 'ClientListViewFilter',
  props: { route: String },
  data: () => ({
    filter: {
      search: '',
      settlementType: 0,
    },
    settlementTypeItems: settlementType.items,
  }),
  watch: {
    '$route.query': {
      immediate: true,
      handler(value) {
        if (!value) {
          return;
        }

        let isRefresh = false;

        if (!!value.search && this.filter.search !== value.search) {
          this.filter.search = value.search;
          isRefresh = !!this.filter.search;
        }

        if (!!value['settlement-type'] && this.filter.settlementType !== parseInt(value['settlement-type'], 10)) {
           this.filter.settlementType = parseInt(value['settlement-type'], 10);
           isRefresh = this.filter.settlementType !== settlementType.all;
        }

        if (isRefresh) {
          this.$emit('filter', this.filter);
        }
      },
    },
  },
  methods: {
    emitDelayedEvent: debounce(function emit() {
      this.emitEvent();
    }, 500),
    emitEvent() {
      const route = {
        name: this.route,
        query: {},
      };

      if (this.filter.search) {
        route.query.search = this.filter.search;
      }

      if (this.filter.settlementType !== settlementType.all) {
        route.query['settlement-type'] = this.filter.settlementType;
      }

      this.$router.push(route);
      this.$emit('filter', this.filter);
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/assets/main.scss';

  .app-background {
    background-color: $app-background-color !important;
  }
</style>