<template>
  <v-dialog
    :value="isVisible"
    @click:outside="closeDialog"
    @keydown.esc.stop="closeDialog"
    height="300px"
    max-width="500px">
    <v-card>
      <v-card-title class="primary--text text--darken-1 justify-center">
        <h5>{{ title }}</h5>
      </v-card-title>
      <v-card-text class="text-center">
        <span class="text-body-2 black--text" style="white-space: pre-wrap;">{{ message }}</span>
      </v-card-text>
      <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        text
        @click="closeDialog">
        OK
      </v-btn>
      </v-card-actions>
    </v-card>
    </v-dialog>
</template>
<script>
export default {
  name: 'MessageDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    title: String,
    message: String,
    closeRequest: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    closeDialog() {
      this.closeRequest();
    },
  },
};
</script>
