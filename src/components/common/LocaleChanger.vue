<template>
    <v-select
    :items="languages"
    label="Lang"
    @click.stop
    @change="$root.$emit('updateLocalization')"
    v-model="$i18n.locale"
    item-text="text"
    item-value="code"
    hide-details="auto"
    clearable/>
</template>
<script>

export default {
  name: 'LocaleChanger',
  data: () => ({
    languages: [
      { code: 'en', text: 'English' },
      { code: 'pl', text: 'Polski' },
    ],
  }),
};
</script>
<style lang="scss" scoped>
  @import '@/assets/main.scss';

  .app-bar {
    background-color: $app-bar-color !important;
  }

</style>
