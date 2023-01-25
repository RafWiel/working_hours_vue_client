<template>
  <v-app-bar
    app
    class="app-bar"
    dense
    flat>
    <v-btn
      icon
      v-if="$route.meta.isBackButton"
      class="mr-n3"
      @click="$router.push({ name: 'tasks'})">
      <v-icon color="grey lighten-2">mdi-chevron-left</v-icon>
    </v-btn>
    <v-btn
      @click="$emit('menuClicked')"
      v-if="!$route.meta.isLoginView"
      icon>
      <v-icon color="grey lighten-2">mdi-menu</v-icon>
    </v-btn>
    <v-app-bar-title class="px-0 grey--text text--lighten-2 flex text-center">
      <span v-if="$vuetify.breakpoint.xs">{{ $route.meta.title }}</span>
      <span v-else>{{ $route.meta.titleLong }}</span>
    </v-app-bar-title>
    <v-btn
      :disabled="!isApplyEnabled"
      @click="$emit('applyClicked')"
      v-if="$route.meta.isTaskListView"
      icon>
      <v-icon color="grey lighten-2">mdi-check</v-icon>
    </v-btn>
  </v-app-bar>
</template>
<script>

export default
{
  name: 'AppBar',
  props: {
    isApplyEnabled: Boolean,
  },
  mounted() {
    this.$root.$on('updateAppTitle', (title) => {
      this.$route.meta.title = title;
      this.$route.meta.titleLong = title;

      this.$forceUpdate();
    });
  },
};
</script>
<style lang="scss" scoped>
  @import '@/assets/main.scss';

  .app-bar {
    background-color: $app-bar-color !important;
  }

</style>
