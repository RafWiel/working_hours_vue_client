<template>
  <v-container
    fluid
    :class="$vuetify.breakpoint.smAndUp ? 'pt-3' : ''"
    class="pa-0">
    <!-- Header -->
    <v-row
      v-if="$vuetify.breakpoint.smAndUp && items.length > 0"
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
          v-for="column in $vuetify.breakpoint.lgAndUp ? columns : limitedColumns"
          :key="column.id"
          :style="`width: ${$vuetify.breakpoint.mdAndDown ? column.limitedWidth : column.fullWidth}%`"
          :class="isSelectionCheckbox ? 'header_selection_offset_y' : ''"
          @click="emitSortEvent(column.value)"
          @keyup.space="emitSortEvent(column.value)"
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
      v-if="$vuetify.breakpoint.smAndUp && items.length > 0"
      class="mt-0 py-0"/>
    <!-- Rows portrait view -->
    <v-container
      v-if="$vuetify.breakpoint.xs"
      fluid
      class="pa-0">
      <v-row class="no-gutters">
        <v-col class="mx-3 mt-3">
          <v-checkbox
            :disabled="isSelectionDisabled"
            :label="$t('action.selectAll')"
            @click="$emit('selectAll', isAllSelected)"
            v-if="isSelectionCheckbox && items.length > 0"
            v-model="isAllSelected"
            hide-details
            class="shrink list_column mt-0"/>
        </v-col>
      </v-row>
      <v-divider
        v-if="isSelectionCheckbox && items.length > 0"
        class="mt-2"/>
      <v-row
        :key="item.id"
        @click="$emit('itemClick', item.id)"
        v-for="(item, index) in items"
        v-ripple
        justify="center"
        class="no-gutters list_row pt-2">
        <v-col>
          <v-row class="no-gutters px-3 mb-2" align="center">
            <v-col v-if="isSelectionCheckbox">
              <v-checkbox
                @click.stop="$emit('selectionChanged')"
                :disabled="item.isSelectionDisabled"
                v-model="item.isSelected"
                hide-details
                class="shrink list_column mt-0"/>
            </v-col>
            <v-col cols="11">
              <v-row
                :key="column.id"
                v-for="column in limitedColumns"
                class="no-gutters pa-0"
                align="center">
                <!-- Name column -->
                <v-col :cols="portraitCols" class="text_ellipsis label pr-1">
                  {{ $t(`dataGridColumns.${column.value}`) }}
                </v-col>
                <!-- Value column -->
                <v-col class="text_ellipsis">
                  {{ column.isIndex ? index + 1 : item[column.value] }}
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="isDeleteButton">
              <v-icon
                class="deleteButton"
                @click.stop="$emit('itemDeleteClick', item.id)">
                mdi-close
              </v-icon>
            </v-col>
          </v-row>
          <!-- Divider (except last row) -->
          <v-divider
            v-if="index != items.length - 1"/>
          <div v-else/>
        </v-col>
      </v-row>
      <!-- Summary -->
      <v-row
        v-if="isSummary && items.length > 0"
        class="no-gutters"
        align="center" justify="center">
        <v-col>
          <v-divider class="px-0 py-0 black"/>
        </v-col>
      </v-row>
      <v-row
        v-if="isSummary && items.length > 0"
        class="no-gutters py-2">
        <v-col
          v-if="isSelectionCheckbox"
          class="shrink list_column ml-4 mr-3 mt-2">&nbsp;</v-col>
        <v-col cols="11">
          <v-row
            :key="column.id"
            v-for="column in portraitSummaryColumns"
            class="no-gutters px-3 text_ellipsis font-weight-bold"
            align="center">
            <v-col cols="4" class="label">
              {{ $t(`dataGridColumns.${column.value}`) }}
            </v-col>
            <v-col>
              {{ column.sum }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <!-- Rows horizontal view -->
    <v-container
      v-if="$vuetify.breakpoint.smAndUp"
      fluid
      class="pa-0">
      <!-- Rows -->
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
                v-for="column in $vuetify.breakpoint.lgAndUp ? columns : limitedColumns"
                :key="column.id"
                :style="`width: ${$vuetify.breakpoint.mdAndDown ? column.limitedWidth : column.fullWidth}%`"
                :class="isSelectionCheckbox ? 'selection_offset_y' : ''"
                class="list_column text_ellipsis">
                {{ column.isIndex ? index + 1 : item[column.value] }}
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
                v-for="column in $vuetify.breakpoint.lgAndUp ? columns : limitedColumns"
                :key="column.id"
                :style="`width: ${$vuetify.breakpoint.mdAndDown ? column.limitedWidth : column.fullWidth}%`"
                :class="isSelectionCheckbox ? 'selection_offset_y' : ''"
                class="list_column text_ellipsis font-weight-bold">
                {{ column.isSum ? column.sum : '&nbsp;' }}
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
    portraitCols: Number,
    isDeleteButton: Boolean,
    isSelectionCheckbox: Boolean,
    isSummary: Boolean,
  },
  computed: {
    limitedColumns() {
      // filter headers for mobile portrait view
      return this.columns.filter((item) => item.limitedWidth !== undefined);
    },
    portraitSummaryColumns() {
      // filter headers for mobile portrait view
      return this.columns.filter((item) => item.isSum);
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
    emitSortEvent(column) {
      const route = {
        name: this.route,
        query: JSON.parse(JSON.stringify(this.$route.query)),
      };

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

      route.query.sort = this.sorting.column ? this.sorting.column : null;
      route.query.order = this.sorting.column ? this.sorting.order : null;

      this.saveToLocalStorage();
      this.$router.push(route);
      this.$emit('sort', this.sorting);
    },
    saveToLocalStorage() {
      console.log('save', `${this.$route.name}Sorting`, JSON.stringify(this.sorting));
      localStorage.setItem(`${this.$route.name}Sorting`, JSON.stringify(this.sorting));
    },
    loadFromLocalStorage() {
      // prevent double fetch on page refresh by user
      if (this.$route.query && this.$route.query.sort) {
        console.log('break sorting loadFromLocalStorage');
        return;
      }

      const sorting = localStorage.getItem(`${this.$route.name}Sorting`);
      if (sorting) {
        this.sorting = JSON.parse(sorting);
        this.emitSortEvent();
      }

      console.log('load', localStorage.getItem(`${this.$route.name}Sorting`));
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

    @media (max-width: 600px) {
      overflow: hidden;
      padding-right: 0;
    }
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
