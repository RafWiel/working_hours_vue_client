<template>
  <v-expansion-panels
    accordion
    flat>
    <v-expansion-panel class="app-background">
      <v-expansion-panel-header class="pa-0">
        <v-container fluid class="pa-0 mr-4">
          <v-row class="no-gutters">
            <!-- Szukaj -->
            <v-col
              cols="12"
              sm="5"
              lg="8">
              <v-text-field
                ref="search"
                label="Szukaj"
                prepend-inner-icon="mdi-magnify"
                type="input"
                clearable
                hide-details="auto"
                validate-on-blur
                v-model.lazy.trim="filter.search"
                @click.stop
                @keydown.enter.prevent
                @keyup.space.prevent
                @input="emitDelayedEvent(true)"/>
            </v-col>
            <!-- Okres -->
            <v-col
              cols="6"
              sm="4"
              lg="2"
              :class="$vuetify.breakpoint.smAndUp ? 'pl-2' : 'mt-2'">
              <v-select
                v-model="filter.timePeriod"
                :disabled="!!filter.startDate || !!filter.stopDate"
                :items="timePeriodItems"
                item-value="id"
                hide-details="auto"
                label="Okres"
                @click.stop
                @change="emitEvent"/>
            </v-col>
            <!-- Typ -->
            <v-col
              cols="6"
              sm="3"
              lg="2"
              :class="$vuetify.breakpoint.smAndUp ? 'pl-2' : 'pl-2 mt-2'">
              <v-select
                v-model="filter.type"
                :items="typeItems"
                item-value="id"
                hide-details="auto"
                label="Typ"
                @click.stop
                @change="emitEvent"/>
            </v-col>
          </v-row>
        </v-container>
      </v-expansion-panel-header>
      <v-expansion-panel-content class="mr-n2">
        <v-container
          fluid
          class="pa-0"
          :class="$vuetify.breakpoint.mdAndUp ? 'ml-n6' : 'ml-n6 mt-2 mr-n2 pr-n4'">
          <v-row class="no-gutters">
            <!-- Data początkowa -->
            <v-col
              cols="6"
              sm="5"
              lg="2"
              :class="$vuetify.breakpoint.smAndUp ? '' : 'mt-1'">
              <v-menu
                v-model="isStartDatePickerVisible"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                class="pa-0"
                min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="filter.startDate"
                    :disabled="filter.timePeriod !== 0"
                    label="Data początkowa"
                    readonly
                    clearable
                    hide-details="auto"
                    v-bind="attrs"
                    v-on="on"
                    @click:clear="filter.startDate = 0; emitEvent()"/>
                </template>
                <v-date-picker
                  v-model="filter.startDate"
                  no-title
                  locale="pl-pl"
                  @input="isStartDatePickerVisible = false"
                  @change="emitEvent"/>
              </v-menu>
            </v-col>
            <!-- Data końcowa -->
            <v-col
              cols="6"
              sm="7"
              lg="10"
              :class="$vuetify.breakpoint.smAndUp ? 'pl-2' : 'pl-2 mt-1'">
              <v-menu
                v-model="isStopDatePickerVisible"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                class="pa-0"
                min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="filter.stopDate"
                    :disabled="filter.timePeriod !== 0"
                    label="Data końcowa"
                    readonly
                    clearable
                    hide-details="auto"
                    v-bind="attrs"
                    v-on="on"
                    @click:clear="filter.stopDate = 0; emitEvent()"/>
                </template>
                <v-date-picker
                  v-model="filter.stopDate"
                  no-title
                  locale="pl-pl"
                  @input="isStopDatePickerVisible = false"
                  @change="emitEvent"/>
              </v-menu>
            </v-col>
          </v-row>
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import debounce from 'lodash.debounce'; // debounce - opoznienie
import timePeriod from '@/enums/timePeriod';
import taskType from '@/enums/taskType';


export default {
  name: 'ListViewFilter',
  data: () => ({
    filter: {
      search: '',
      ownership: 0,
      timePeriod: 0,
      simpleStatus: 0,
      startDate: null,
      stopDate: null,
      type: 0,
      submitType: 0,
      status: 0,
    },
    isStartDatePickerVisible: false,
    isStopDatePickerVisible: false,
    timePeriodItems: timePeriod.items,
    typeItems: taskType.items,
  }),
  watch: {
    '$route.query': {
      immediate: true,
      handler(value) {
        let isRefresh = false;

        if (!!value.search && this.filter.search !== value.search) {
          this.filter.search = value.search;
          isRefresh = !!this.filter.search;
        }

        if (!!value['time-period'] && this.filter.timePeriod !== parseInt(value['time-period'], 10)) {
          this.filter.timePeriod = parseInt(value['time-period'], 10);
          isRefresh = this.filter.timePeriod !== timePeriod.all;
        }

        if (!!value.type && this.filter.type !== parseInt(value.type, 10)) {
           this.filter.type = parseInt(value.type, 10);
           isRefresh = this.filter.type !== taskType.all;
        }

        if (!!value['start-date'] && this.filter.startDate !== value['start-date']) {
          this.filter.startDate = value['start-date'];
          isRefresh = !!this.filter.startDate;
        }

        if (!!value['stop-date'] && this.filter.stopDate !== value['stop-date']) {
          this.filter.stopDate = value['stop-date'];
          isRefresh = !!this.filter.stopDate;
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
        name: 'tasks',
        query: {},
      };

      if (this.filter.search) {
        route.query.search = this.filter.search;
      }

      if (this.filter.timePeriod !== timePeriod.all) {
        route.query['time-period'] = this.filter.timePeriod;
      }

      if (this.filter.type !== taskType.all) {
        route.query.type = this.filter.type;
      }

      if (this.filter.startDate) {
        route.query['start-date'] = this.filter.startDate;
      }

      if (this.filter.stopDate) {
        route.query['stop-date'] = this.filter.stopDate;
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
