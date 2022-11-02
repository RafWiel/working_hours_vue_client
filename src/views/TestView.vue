<template>
  <div
    fill-height
    class="d-flex flex-column blue"
    :style="$vuetify.breakpoint.xs ? 'min-height: calc(100vh - 48px)' : ''">
    <v-card
      class="d-flex align-start flex-column mb-6"
      color="grey lighten-2"
      flat
      tile
      height="200"
    >
      <v-card class="pa-2 mb-auto" outlined tile> Flex item </v-card>

      <v-card class="pa-2" outlined tile> Flex item </v-card>

      <v-card class="pa-2" outlined tile> Flex item </v-card>
    </v-card>

    <v-card
      class="d-flex grow align-end flex-column"
      color="grey lighten-2"
      flat
      tile
      fill-height

    >
      <v-card class="pa-2" outlined tile> Flex item </v-card>

      <v-card class="pa-2" outlined tile> Flex item </v-card>

      <v-card class="pa-2 mt-auto" outlined tile> Flex item </v-card>
    </v-card>
  </div>
</template>

<script>

export default {
  name: 'TestView',
};
</script>

<style lang="scss" scoped>
  @import '@/assets/main.scss';

</style>
