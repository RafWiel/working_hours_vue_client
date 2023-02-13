<template>
  <v-dialog
    :value=isVisible
    @click:outside="hideDialog"
    @keydown.esc.stop="hideDialog"
    id="dialog"
    height="300px"
    max-width="500px">
    <v-card>
      <v-card-title class="primary--text text--darken-1 justify-center">
        <h5>Ustaw datę</h5>
      </v-card-title>
      <v-card-text class="text-center">
        <v-menu
          v-model="isDatePickerVisible"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          class="pa-0"
          min-width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              :rules="[rules.required]"
              v-model="date"
              label="Data"
              readonly
              hide-details="auto"
              v-bind="attrs"
              v-on="on"/>
          </template>
          <v-date-picker
            :locale="$t('locale')"
            v-model="date"
            no-title
            @input="isDatePickerVisible = false"/>
        </v-menu>
      </v-card-text>
      <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        @click="hideDialog"
        ref="cancelButton"
        color="primary"
        text>
        Anuluj
      </v-btn>
      <v-btn
        @click="applyDialog"
        ref="okButton"
        color="primary"
        text>
        OK
      </v-btn>
      </v-card-actions>
    </v-card>
    </v-dialog>
</template>
<script>
import rules from '@/misc/rules';
import moment from 'moment';

export default {
  name: 'DatePickerDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    hideRequest: {
      type: Function,
      default: () => {},
    },
  },
  data: () => ({
    isDatePickerVisible: false,
    date: null,
    rules: { required: rules.required },
  }),
  mounted() {
    this.date = moment(new Date()).format('YYYY-MM-DD');
  },
  methods: {
    applyDialog() {
      this.$emit('apply', this.date);
      this.hideRequest();
    },
    hideDialog() {
      this.hideRequest();
    },
  },
};
</script>


