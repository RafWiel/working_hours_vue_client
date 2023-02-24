<template>
  <client-list-view-filter-layout>
    <!-- Search -->
    <template v-slot:search>
      <v-text-field
        :label="$t('filter.search')"
        @click.stop
        @keydown.enter.prevent
        @keyup.space.prevent
        @input="emitDelayedFilterEvent(true)"
        ref="search"
        prepend-inner-icon="mdi-magnify"
        type="input"
        clearable
        hide-details="auto"
        validate-on-blur
        v-model.lazy.trim="filter.search"/>
    </template>
    <!-- Settlement -->
    <template v-slot:settlement>
      <v-select
        :items="settlementTypeItems"
        :label="$t('filter.settlement')"
        @click.stop
        @change="emitFilterEvent"
        v-model="filter.settlementType"
        item-value="id"
        hide-details="auto"/>
    </template>
    <!-- Portrait sorting -->
    <template v-slot:portraitSorting>
      <portrait-sorting
        :columns="portraitColumns"
        @sort="emitSortEvent"
        ref="portrait-sorting"/>
    </template>
  </client-list-view-filter-layout>
</template>

<script>
import debounce from 'lodash.debounce'; // debounce - opoznienie
import settlementType from '@/enums/settlementType';
import PortraitSorting from '@/components/PortraitSorting.vue';
import ClientListViewFilterLayout from './ClientListViewFilterLayout.vue';

export default {
  name: 'ClientListViewFilter',
  components: {
    ClientListViewFilterLayout,
    PortraitSorting,
  },
  props: {
    route: String,
    portraitColumns: Array,
  },
  computed: {
    settlementTypeItems() {
      return settlementType.getItems();
    },
  },
  data: () => ({
    filter: {
      search: '',
      settlementType: 0,
    },
  }),
  mounted() {
    //unsettled by default
    if (!this.$route.query['settlement-type']) {
      this.filter.settlementType = settlementType.unsettled;
      this.emitFilterEvent();
    }
  },
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
           isRefresh = this.filter.settlementType !== settlementType.none;
        }

        if (isRefresh) {
          this.$emit('filter', this.filter);
        }
      },
    },
  },
  methods: {
    emitDelayedFilterEvent: debounce(function emit() {
      this.emitFilterEvent();
    }, 500),
    emitFilterEvent() {
      const route = {
        name: this.route,
        query: {},
      };

      if (this.filter.search) {
        route.query.search = this.filter.search;
      }

      if (this.filter.settlementType !== settlementType.none) {
        route.query['settlement-type'] = this.filter.settlementType;
      }

      this.$router.push(route);
      this.$emit('filter', this.filter);
    },
    emitSortEvent(sorting) {
      this.$emit('sort', sorting);
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
