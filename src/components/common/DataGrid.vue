<template>
  <v-container fluid class="pa-0 pt-3">
    <!-- Header -->
    <v-row
      v-if="items.length > 0"
      class="no-gutters px-4">
      <!-- 12 columns is to little, thats why one column and inside divs with percentage width -->
      <v-col class="pl-0 py-0 text-body-2 grey--text ">
        <v-checkbox
          @click="$emit('selectAll', isAllSelected)"
          :disabled="isSelectionDisabled"
          v-if="isSelectionCheckbox"
          v-model="isAllSelected"
          hide-details
          class="shrink list_column mt-0"/>
        <div
          v-for="column in computedColumns"
          :key="column.id"
          :style="`width: ${getColumnWidth(column)}%`"
          :class="isSelectionCheckbox ? 'header_selection_offset_y' : ''"
          @click="sort(column.value)"
          @keyup.space="sort(column.value)"
          class="list_column text_ellipsis"
          style="height: 1.7em;"
          v-ripple>
          {{ $t(`dataGridColumns.${column.value}`) }}
          <v-icon
            v-if="sorting.column === column.value && sorting.order === sortOrder.ascending"
            style="margin-top: -2px;">mdi-chevron-up</v-icon>
          <v-icon
            v-if="sorting.column === column.value && sorting.order === sortOrder.descending"
            style="margin-top: -2px;">mdi-chevron-down</v-icon>
        </div>
      </v-col>
      <v-col cols="auto">
        <!-- Invisible icon to match header and rows columns width -->
        <v-icon
          v-if="isDeleteButton"
          style="opacity: 0">
          mdi-close
        </v-icon>
      </v-col>
    </v-row>
    <v-divider
      v-if="items.length > 0"
      class="mt-0 py-0"/>
    <!-- Rows -->
    <v-container fluid class="pa-0">
      <v-row
        v-for="(item, index) in items"
        :key="item.id"
        v-ripple
        class="no-gutters list_row"
        align="center" justify="center"
        @click="$emit('itemClick', item.id)">
        <v-col>
          <v-row class="no-gutters px-4" align="center">
            <v-col class="pl-0 py-1">
              <v-checkbox
                @click.stop="$emit('selectionChanged')"
                :disabled="item.isSelectionDisabled"
                v-if="isSelectionCheckbox"
                v-model="item.isSelected"
                hide-details
                class="shrink list_column mt-0"/>
                <div
                  v-for="column in computedColumns"
                  :key="column.id"
                  :style="`width: ${getColumnWidth(column)}%`"
                  :class="isSelectionCheckbox ? 'selection_offset_y' : ''"
                  class="list_column py-0 text_ellipsis">
                  {{ column.isIndex ? index + 1 : formatValue(item, column) }}
                </div>
            </v-col>
            <v-col cols="auto">
              <v-icon
                v-if="isDeleteButton"
                class="deleteButton"
                @click.stop="$emit('itemDeleteClick', item.id)">
                mdi-close
              </v-icon>
            </v-col>
          </v-row>
          <v-divider class="px-1 py-0" v-if="index != items.length - 1"/>
        </v-col>
      </v-row>
      <!-- Summary -->
      <v-row
        v-if="isSummary && items.length > 0"
        class="no-gutters"
        align="center" justify="center">
        <v-col>
          <v-divider class="px-1 py-0 black"/>
          <v-row class="no-gutters px-4" align="center">
            <v-col class="pl-0 py-1">
              <div
                v-if="isSelectionCheckbox"
                class="shrink list_column ml-4 mr-3 mt-2">&nbsp;</div>
              <div
                v-for="column in computedColumns"
                :key="column.id"
                :style="`width: ${getColumnWidth(column)}%`"
                :class="isSelectionCheckbox ? 'selection_offset_y' : ''"
                class="list_column text_ellipsis font-weight-bold">
                {{ column.isSum ? formatSum(column) : '&nbsp;' }}
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <div
      v-if="items.length === 0"
      class="d-flex justify-center text-body-1 grey--text text--lighten-2 py-8">
      Brak danych
    </div>
  </v-container>
</template>

<script>
import sortOrder from '@/enums/sortOrder';

export default {
  name: 'DataGrid',
  props: {
    items: Array,
    columns: Array,
    isDeleteButton: Boolean,
    isSelectionCheckbox: Boolean,
    isSummary: Boolean,
  },
  computed: {
    computedColumns() {
      if (this.$vuetify.breakpoint.xl) {
        return this.columns.filter((u) => !!u.width.xl === true);
      }

      if (this.$vuetify.breakpoint.mdAndUp) {
        return this.columns.filter((u) => !!u.width.md === true);
      }

      if (this.$vuetify.breakpoint.smAndUp) {
        return this.columns.filter((u) => !!u.width.sm === true);
      }

      return this.columns.filter((u) => !!u.width.xs === true);
    },
    isSelectionDisabled() {
      // filter headers for mobile portrait view
      const disabledItemsCount = this.items.filter((item) => item.isSelectionDisabled).length;

      return this.items.length === disabledItemsCount;
    },
  },
  data: () => ({
    sorting: {
      column: null,
      order: sortOrder.ascending,
    },
    sortOrder,
    isAllSelected: false,
  }),
  mounted() {
    this.loadFromLocalStorage();
  },
  methods: {
    sort(column) {
      if (column !== this.sorting.column) {
        this.sorting.column = column;
        this.sorting.order = sortOrder.ascending;
      }
      else if (this.sorting.order === sortOrder.ascending) {
        this.sorting.order = sortOrder.descending;
      }
      else {
        this.sorting.order = sortOrder.ascending;
      }

      this.emitSortEvent();
    },
    emitSortEvent() {
      const route = {
        name: this.route,
        query: JSON.parse(JSON.stringify(this.$route.query)),
      };

      route.query.sort = this.sorting.column ? this.sorting.column : null;
      route.query.order = this.sorting.column ? this.sorting.order : null;

      this.saveToLocalStorage();
      this.$router.replace(route);
      this.$emit('sort', this.sorting);
    },
    saveToLocalStorage() {
      // console.log('save', `${this.$route.name}Sorting`, JSON.stringify(this.sorting));
      localStorage.setItem(`${this.$route.name}Sorting`, JSON.stringify(this.sorting));
    },
    loadFromLocalStorage() {
      // ignore if query contains data
      if (this.$route.query && this.$route.query.sort) {
        return;
      }

      // console.log('load', localStorage.getItem(`${this.$route.name}Sorting`));

      const sorting = localStorage.getItem(`${this.$route.name}Sorting`);
      if (sorting) {
        this.sorting = JSON.parse(sorting);
        this.emitSortEvent();
      }
    },
    getColumnWidth(column) {
      if (this.$vuetify.breakpoint.xl && column.width.xl) {
        return column.width.xl;
      }

      if (this.$vuetify.breakpoint.mdAndUp && column.width.md) {
        return column.width.md;
      }

      if (this.$vuetify.breakpoint.smAndUp && column.width.sm) {
        return column.width.sm;
      }

      return column.width.xs;
    },
    formatValue(item, column) {
      const value = item[column.value];

      if (value && (column.decimalDigits || column.decimalDigits === 0)) {
        // prevent rounding up to integer
        if (parseFloat(value) !== parseInt(value, 10) && column.decimalDigits === 0) {
          return parseFloat(value).toFixed(1);
        }

        return parseFloat(value).toFixed(column.decimalDigits);
      }

      return value;
    },
    formatSum(column) {
      const value = column.sum;

      if (column.decimalDigits || column.decimalDigits === 0) {
        // prevent rounding up to integer
        if (parseFloat(value) !== parseInt(value, 10) && column.decimalDigits === 0) {
          return parseFloat(value).toFixed(1);
        }

        return parseFloat(value).toFixed(column.decimalDigits);
      }

      return column.sum;
    },
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler(value) {
        if (!value) {
          return;
        }

        let isRefresh = false;

        if (!!value.sort && this.sorting.column !== value.sort) {
          this.sorting.column = value.sort;
          isRefresh = !!this.sorting.column;
        }

        if (!!value.order && this.sorting.order !== parseInt(value.order, 10)) {
          this.sorting.order = parseInt(value.order, 10);
          isRefresh = true;
        }

        if (isRefresh) {
          this.saveToLocalStorage();
          this.$emit('sort', this.sorting);
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>

  .text_ellipsis {
    overflow: clip;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 10px;
  }

  .list_row {
    cursor: pointer;
    user-select: none;
    transition: background-color .25s;
  }

  .list_row:hover {
    //background-color: rgba(41,116,183, .35);
    background-color: #dce1e6;
    transition: background-color 0s;
  }

  .list_row:selection {
    background-color: #ff00f0;
    transition: background-color 0s;
  }

  .list_column {
    display: inline-block;
    cursor: pointer;
  }

  .label {
    color: rgba(160,160,160);
    font-size: .8em;
  }

  .v-icon:after {
    opacity: 0 !important;
  }

  .deleteButton:hover {
    color: #ff0000;
    transition: color 0s;
  }

  .header_selection_offset_y {
    margin-top: -5px;
    vertical-align: middle;
  }

  .selection_offset_y {
    margin-top: -10px;
    vertical-align: middle;
  }

</style>
