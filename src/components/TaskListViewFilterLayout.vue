<template>
  <div>
    <!-- Lg view -->
    <v-container
      v-if="$vuetify.breakpoint.lgAndUp"
      fluid class="pa-0">
      <v-row class="no-gutters">
        <!-- Search -->
        <v-col cols="3" xl="4">
          <slot name="search"/>
        </v-col>
        <!-- Period -->
        <v-col cols="2" xl="2" class="pl-2">
          <slot name="period"/>
        </v-col>
        <!-- Start date -->
        <v-col cols="1" class="pl-2">
          <slot name="startDate"/>
        </v-col>
        <!-- End date -->
        <v-col cols="1" class="pl-2">
          <slot name="endDate"/>
        </v-col>
        <!-- Invoice -->
        <v-col cols="2" class="pl-2">
          <slot name="invoice"/>
        </v-col>
        <!-- Settlement -->
        <v-col cols="2" xl="1" class="pl-2">
          <slot name="settlement"/>
        </v-col>
        <!-- Task type -->
        <v-col cols="1" class="pl-2">
          <slot name="taskType"/>
        </v-col>
      </v-row>
    </v-container>
    <!-- mdAndDown View -->
    <v-expansion-panels
      v-if="$vuetify.breakpoint.mdAndDown"
      accordion
      value="2"
      flat>
      <v-expansion-panel class="app-background">
        <v-expansion-panel-header class="pa-0">
          <v-container fluid class="pa-0 mr-4">
            <v-row class="no-gutters">
              <!-- Search -->
              <v-col cols="12" sm="9" md="5">
                <slot name="search"/>
              </v-col>
              <!-- Invoice md -->
              <v-col
                v-if="$vuetify.breakpoint.md"
                class="pl-2"
                cols="3">
                <slot name="invoice"/>
              </v-col>
              <!-- Settlement md -->
              <v-col
                v-if="$vuetify.breakpoint.md"
                class="pl-2"
                cols="2">
                <slot name="settlement"/>
              </v-col>
              <!-- Task type md -->
              <v-col
                v-if="$vuetify.breakpoint.md"
                class="pl-2"
                cols="2">
                <slot name="taskType"/>
              </v-col>
              <!-- Task type sm -->
              <v-col
                v-if="$vuetify.breakpoint.sm"
                class="pl-2"
                cols="3">
                <slot name="taskType"/>
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="mr-n2">
          <v-container
            fluid
            class="pa-0"
            :class="$vuetify.breakpoint.mdAndUp ? 'ml-n6' : 'ml-n6 mr-n2 pr-n4'">
            <v-row class="no-gutters">
              <!-- Period -->
              <v-col
                cols="6"
                md="5">
                <slot name="period"/>
              </v-col>
              <!-- Task type xs -->
              <v-col
                v-if="$vuetify.breakpoint.xs"
                class="pl-2"
                cols="6">
                <slot name="taskType"/>
              </v-col>
              <!-- Start date -->
              <v-col
                :class="$vuetify.breakpoint.xs ? 'mt-2' : 'pl-2'"
                cols="6"
                md="3"
                sm="3">
                <slot name="startDate"/>
              </v-col>
              <!-- End date -->
              <v-col
                :class="$vuetify.breakpoint.xs ? 'mt-2' : ''"
                class="pl-2"
                cols="6"
                md="4"
                sm="3">
                <slot name="endDate"/>
              </v-col>
              <!-- Invoice smAndDown -->
              <v-col
                v-if="$vuetify.breakpoint.smAndDown"
                class="mt-2"
                cols="6">
                <slot name="invoice"/>
              </v-col>
              <!-- Settlement smAndDown -->
              <v-col
                v-if="$vuetify.breakpoint.smAndDown"
                class="mt-2 pl-2"
                cols="6">
                <slot name="settlement"/>
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
  name: 'TaskListViewFilterLayout',
};
</script>

<style lang="scss" scoped>
  @import '@/assets/main.scss';

  .app-background {
    background-color: $app-background-color !important;
  }
</style>
