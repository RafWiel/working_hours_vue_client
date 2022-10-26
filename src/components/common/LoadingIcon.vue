<template>
  <v-progress-circular
    class="centerScreen"
    color="primary"
    indeterminate
    size="60"
    width="5"
  />
  <!-- <div class="loadingIcon centerScreen" /> -->
</template>

<script>
export default { name: 'LoadingIcon' };
</script>

<style lang="scss" scoped>
  .centerScreen {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transform: -webkit-translate(-50%, -50%);
    transform: -moz-translate(-50%, -50%);
    transform: -ms-translate(-50%, -50%);
  }
</style>
