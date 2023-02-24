<template>
  <div>
    <!-- mdAndUp view -->
    <v-container
      v-if="$vuetify.breakpoint.smAndUp"
      fluid class="pa-0">
      <v-row class="no-gutters">
        <!-- Search -->
        <v-col
          cols="8"
          lg="10"
          md="9">
          <slot name="search"/>
        </v-col>
        <!-- Settlement -->
        <v-col
          class="pl-2"
          cols="4"
          lg="2"
          md="3">
          <slot name="settlement"/>
        </v-col>
      </v-row>
    </v-container>
    <!-- xs View -->
    <v-expansion-panels
      v-if="$vuetify.breakpoint.xs"
      accordion
      value="2"
      flat>
      <v-expansion-panel class="app-background">
        <v-expansion-panel-header class="pa-0">
          <v-container fluid class="pa-0 mr-4">
            <v-row class="no-gutters">
              <!-- Search -->
              <v-col cols="12">
                <slot name="search"/>
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="mr-n2">
          <v-container
            fluid
            class="pa-0 ml-n6 mr-n2 pr-n4">
            <v-row class="no-gutters">
              <!-- Settlement -->
              <v-col cols="12" class="mt-2">
                <slot name="settlement"/>
              </v-col>
              <!-- Portrait sorting -->
              <v-col cols="12" class="mt-2">
                <slot name="portraitSorting"/>
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  name: 'ClientListViewFilterLayout',
};
</script>

<style lang="scss" scoped>
  @import '@/assets/main.scss';

  .app-background {
    background-color: $app-background-color !important;
  }
</style>
