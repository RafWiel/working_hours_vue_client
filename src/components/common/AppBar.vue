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
      @click="$router.go(-1)">
      <v-icon color="grey lighten-2">mdi-chevron-left</v-icon>
    </v-btn>
    <v-btn
      @click="$emit('menuClicked')"
      v-if="!$route.meta.isMenuHidden"
      icon>
      <v-icon color="grey lighten-2">mdi-menu</v-icon>
    </v-btn>
    <v-app-bar-title class="px-0 grey--text text--lighten-2 flex text-center">
      {{ title }} &nbsp;
    </v-app-bar-title>
    <v-btn
      :disabled="!isApplyEnabled"
      @click="$emit('applyClicked')"
      v-if="isSettleTaskButton"
      icon>
      <v-icon color="grey lighten-2">mdi-check</v-icon>
    </v-btn>
    <locale-changer />
  </v-app-bar>
</template>
<script>
import userType from '@/enums/userType';
import LocaleChanger from './LocaleChanger.vue';

export default
{
  components: { LocaleChanger },
  name: 'AppBar',
  props: {
    isApplyEnabled: Boolean,
  },
  computed: {
    isSettleTaskButton() {
      return this.$route.meta.isTaskListView && this.$store.state.userType === userType.administrator;
    },
  },
  data: () => ({
    title: null,
  }),
  mounted() {
    this.$root.$on('updateAppTitle', (title) => {
      this.title = title;

      //this.$forceUpdate();
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
