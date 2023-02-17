<template>
  <v-navigation-drawer
    app
    hide-overlay
    temporary
    class="primary elevation-0"
    v-model="isOpen">
    <v-container fill-height>
      <v-row class="align-self-start">
        <v-list class="fill-width pa-0">
          <v-list-item @click="$emit('isOpenChanged', false)" class="menu" >
            <v-list-item-action class="mr-4">
              <v-icon class="grey--text text--lighten-2">mdi-menu</v-icon>
            </v-list-item-action>
          </v-list-item>
          <v-list-item
            v-for="link in links"
            :key="link.id"
            router
            :to="link.route">
            <v-list-item-action class="mr-4">
              <v-icon class="grey--text text--lighten-2">{{ link.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text text--lighten-2">
                {{ $t(`menuItems.${link.value}`) }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-row>
      <v-row class="align-self-end">
        <v-list class="fill-width pa-0">
          <v-list-item router :to="logoutRoute">
            <v-list-item-action class="mr-4">
              <v-icon class="grey--text text--lighten-2">mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text text--lighten-2">
                {{ $t('action.logout') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script>

export default {
  name: 'SideBar',
  props: {
    value: Boolean,
    links: Array,
  },
  computed: {
    logoutRoute() {
      return '/login';
    },
  },
  data() {
    return { isOpen: this.value };
  },
  watch: {
    value(val) {
      this.isOpen = val;
    },
    isOpen(val) {
      this.$emit('isOpenChanged', val);
    },
  },
};
</script>

<style lang="scss">
  @import '@/assets/main.scss';

  .menu {
    background-color: $app-bar-color;
  }

  .fill-width {
    width: 100%;
  }

</style>
